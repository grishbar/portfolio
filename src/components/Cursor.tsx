import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const INTERACTIVE = 'a, button, input, textarea, select, [data-cursor="hover"]'

/**
 * Custom cursor: a small dot that sticks to the pointer and a lagging ring
 * that grows over interactive elements. Hidden on touch devices.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 300, damping: 28, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 300, damping: 28, mass: 0.6 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    setEnabled(fine.matches)
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches)
    fine.addEventListener('change', onChange)
    return () => fine.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('custom-cursor')

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target as Element | null
      setHovering(!!target?.closest?.(INTERACTIVE))
    }
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      document.documentElement.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const ringScale = pressed ? 0.8 : hovering ? 2.2 : 1

  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} />
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
        animate={{ scale: ringScale, opacity: hovering ? 0.9 : 0.5 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      />
    </>
  )
}

/** Soft radial glow that follows the cursor behind the content. */
export function CursorGlow() {
  const x = useMotionValue(-600)
  const y = useMotionValue(-600)
  const gx = useSpring(x, { stiffness: 60, damping: 20 })
  const gy = useSpring(y, { stiffness: 60, damping: 20 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - 300)
      y.set(e.clientY - 300)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  return <motion.div className="cursor-glow" style={{ x: gx, y: gy }} aria-hidden />
}
