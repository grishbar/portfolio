import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

let lenisInstance: Lenis | null = null

/** Initialize Lenis smooth scrolling once for the whole app. */
export function useLenis() {
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })
    lenisInstance = lenis

    const raf = (time: number) => {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafRef.current)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])
}

/** Smoothly scroll to an element by id (used by nav and CTA buttons). */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -72, duration: 1.4 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

/** Pause/resume Lenis while a modal or lightbox is open. */
export function stopLenis() {
  lenisInstance?.stop()
}

export function startLenis() {
  lenisInstance?.start()
}
