import { useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import type { Localized } from '../lib/i18n'
import { stopLenis, startLenis } from '../lib/useLenis'
import ui from '../data/ui.json'

export interface LightboxMediaItem {
  type: 'image' | 'video'
  src: string
  caption?: Localized
}

interface MediaLightboxProps {
  items: LightboxMediaItem[]
  index: number | null
  onClose: () => void
  onChange: (index: number) => void
}

const swipeThreshold = 60

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? '40%' : '-40%',
    opacity: 0,
    scale: direction === 0 ? 0.92 : 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction === 0 ? 0 : direction < 0 ? '40%' : '-40%',
    opacity: 0,
    scale: 0.96,
  }),
}

export function MediaLightbox({ items, index, onClose, onChange }: MediaLightboxProps) {
  const { t } = useI18n()
  const reduceMotion = useReducedMotion()
  const directionRef = useRef(0)
  const open = index !== null && items.length > 0
  const current = open ? items[index] : null

  const go = useCallback(
    (next: number, direction: number) => {
      if (items.length === 0) return
      directionRef.current = direction
      const wrapped = (next + items.length) % items.length
      onChange(wrapped)
    },
    [items.length, onChange],
  )

  const goPrev = useCallback(() => {
    if (index === null) return
    go(index - 1, -1)
  }, [go, index])

  const goNext = useCallback(() => {
    if (index === null) return
    go(index + 1, 1)
  }, [go, index])

  useEffect(() => {
    if (!open) {
      directionRef.current = 0
      return
    }

    stopLenis()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      startLenis()
    }
  }, [open, onClose, goPrev, goNext])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -swipeThreshold || info.velocity.x < -500) goNext()
    else if (info.offset.x > swipeThreshold || info.velocity.x > 500) goPrev()
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t(ui.experience.lightbox.label)}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: reduceMotion ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            type="button"
            className="lightbox__backdrop"
            aria-label={t(ui.experience.lightbox.close)}
            onClick={onClose}
            data-cursor="hover"
          />

          <div className="lightbox__chrome">
            <p className="lightbox__counter">
              {index! + 1}
              <span aria-hidden> / </span>
              {items.length}
            </p>
            <button
              type="button"
              className="lightbox__close"
              onClick={onClose}
              aria-label={t(ui.experience.lightbox.close)}
              data-cursor="hover"
            >
              <CloseIcon />
            </button>
          </div>

          {items.length > 1 && (
            <>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--prev"
                onClick={goPrev}
                aria-label={t(ui.experience.lightbox.prev)}
                data-cursor="hover"
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--next"
                onClick={goNext}
                aria-label={t(ui.experience.lightbox.next)}
                data-cursor="hover"
              >
                <ChevronIcon direction="right" />
              </button>
            </>
          )}

          <div className="lightbox__stage">
            <AnimatePresence initial={false} custom={directionRef.current} mode="popLayout">
              <motion.figure
                key={`${current.src}-${index}`}
                className="lightbox__figure"
                custom={directionRef.current}
                variants={reduceMotion ? undefined : slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                drag={items.length > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={onDragEnd}
              >
                {current.type === 'video' ? (
                  <video
                    key={current.src}
                    src={current.src}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    className="lightbox__media"
                  />
                ) : (
                  <img
                    src={current.src}
                    alt={current.caption ? t(current.caption) : ''}
                    className="lightbox__media"
                    draggable={false}
                  />
                )}
                {current.caption && (
                  <figcaption className="lightbox__caption">{t(current.caption)}</figcaption>
                )}
              </motion.figure>
            </AnimatePresence>
          </div>

          {items.length > 1 && (
            <div className="lightbox__dots" role="tablist" aria-label={t(ui.experience.lightbox.label)}>
              {items.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${i + 1}`}
                  className={`lightbox__dot${i === index ? ' is-active' : ''}`}
                  onClick={() => {
                    if (index === null || i === index) return
                    directionRef.current = i > index ? 1 : -1
                    onChange(i)
                  }}
                  data-cursor="hover"
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      {direction === 'left' ? (
        <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}
