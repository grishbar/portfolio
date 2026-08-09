import { useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import type { Localized } from '../lib/i18n'
import { Reveal } from '../components/Reveal'
import { MediaLightbox } from '../components/MediaLightbox'
import experience from '../data/experience.json'
import media from '../data/media.json'
import ui from '../data/ui.json'

interface MediaItem {
  type: 'image' | 'video'
  src: string
  caption?: Localized
}

const mediaByCompany = media as unknown as Record<string, MediaItem[]>

export function Experience() {
  const { t } = useI18n()

  return (
    <section className="section experience" id="experience">
      <div className="section__inner">
        <Reveal>
          <p className="section__kicker">{t(ui.experience.kicker)}</p>
          <h2 className="section__title">{t(ui.experience.title)}</h2>
        </Reveal>

        <div className="timeline">
          {experience.jobs.map((job, index) => (
            <Reveal key={job.id} delay={0.05 * index} className="timeline__item">
              <div className="timeline__marker" style={{ '--accent': job.accent } as React.CSSProperties}>
                <span className="timeline__dot" />
                <span className="timeline__line" />
              </div>

              <motion.article
                className="job-card"
                style={{ '--accent': job.accent } as React.CSSProperties}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <header className="job-card__header">
                  <div className="job-card__brand">
                    <a
                      className="job-card__logo"
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${job.company} website`}
                    >
                      <img src={job.logo} alt={`${job.company} logo`} loading="lazy" />
                    </a>
                    <div>
                      <h3 className="job-card__company">
                        <a href={job.url} target="_blank" rel="noreferrer">
                          {job.company}
                          <ExternalIcon />
                        </a>
                      </h3>
                      <p className="job-card__role">{t(job.role)}</p>
                    </div>
                  </div>
                  <span className="job-card__period">{t(job.period)}</span>
                </header>

                <p className="job-card__summary">{t(job.summary)}</p>

                {'steps' in job && job.steps && (
                  <details className="job-card__steps">
                    <summary>{t(ui.experience.growthPath)}</summary>
                    <ul>
                      {job.steps.map((step, i) => (
                        <li key={i}>
                          <span>{t(step.role)}</span>
                          <span className="job-card__step-period">{t(step.period)}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}

                <ul className="job-card__highlights">
                  {job.highlights.map((h, i) => (
                    <li key={i} className={'backend' in h && h.backend ? 'job-card__highlight--backend' : ''}>
                      {'backend' in h && h.backend && (
                        <span className="backend-badge">{t(ui.experience.backendBadge)}</span>
                      )}
                      {t(h)}
                    </li>
                  ))}
                </ul>

                <MediaGallery items={mediaByCompany[job.id] ?? []} />

                <footer className="job-card__tags">
                  {job.tags.map((tag) => (
                    <span key={tag} className="tag" data-cursor="hover">
                      {tag}
                    </span>
                  ))}
                </footer>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExternalIcon() {
  return (
    <svg
      className="job-card__ext"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}

function MediaGallery({ items }: { items: MediaItem[] }) {
  const { t } = useI18n()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (items.length === 0) {
    return (
      <div className="media-gallery media-gallery--empty">
        <span className="media-gallery__icon" aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </span>
        <p>{t(ui.experience.mediaSoon)}</p>
      </div>
    )
  }

  return (
    <>
      <div className="media-gallery">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            className="media-gallery__item"
            data-cursor="hover"
            onClick={() => setOpenIndex(i)}
            aria-label={
              item.caption
                ? `${t(ui.experience.lightbox.open)}: ${t(item.caption)}`
                : t(ui.experience.lightbox.open)
            }
          >
            <span className="media-gallery__thumb">
              {item.type === 'video' ? (
                <>
                  <video src={item.src} muted playsInline preload="metadata" />
                  <span className="media-gallery__play" aria-hidden>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5.5v13l11-6.5L8 5.5Z" />
                    </svg>
                  </span>
                </>
              ) : (
                <img src={item.src} alt="" loading="lazy" />
              )}
            </span>
            {item.caption && <span className="media-gallery__caption">{t(item.caption)}</span>}
          </button>
        ))}
      </div>

      <MediaLightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onChange={setOpenIndex}
      />
    </>
  )
}
