import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import { scrollToSection } from '../lib/useLenis'
import ui from '../data/ui.json'

const SECTIONS = ['about', 'experience', 'skills', 'teaching', 'education', 'contact'] as const

export function Nav() {
  const { lang, setLang, t } = useI18n()
  const [active, setActive] = useState<string>('')
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const id of SECTIONS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <motion.div className="nav__progress" style={{ scaleX: progress }} />
      <div className="nav__inner">
        <button className="nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="nav__logo-mark">GB</span>
          <span className="nav__logo-dot" />
        </button>

        <nav className="nav__links">
          {SECTIONS.map((id) => (
            <button
              key={id}
              className={`nav__link ${active === id ? 'nav__link--active' : ''}`}
              onClick={() => scrollToSection(id)}
            >
              {t(ui.nav[id])}
            </button>
          ))}
        </nav>

        <div className="nav__lang" role="group" aria-label="Language">
          {(['en', 'ru'] as const).map((code) => (
            <button
              key={code}
              className={`nav__lang-btn ${lang === code ? 'nav__lang-btn--active' : ''}`}
              onClick={() => setLang(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
