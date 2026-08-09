import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import { scrollToSection } from '../lib/useLenis'
import profile from '../data/profile.json'
import ui from '../data/ui.json'
import { GithubIcon, LinkedinIcon, TelegramIcon, MailIcon } from '../components/icons'
import { PhotoFrame } from '../components/PhotoFrame'

export function Hero() {
  const { t } = useI18n()
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((i) => (i + 1) % profile.roles.length)
    }, 2600)
    return () => clearInterval(timer)
  }, [])

  const socials = [
    { href: profile.contacts.github, label: 'GitHub', Icon: GithubIcon },
    { href: profile.contacts.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
    { href: profile.contacts.telegram, label: 'Telegram', Icon: TelegramIcon },
    { href: `mailto:${profile.contacts.email}`, label: 'Email', Icon: MailIcon },
  ]

  return (
    <section className="hero" id="hero">
      <div className="hero__bg" aria-hidden>
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__blob hero__blob--3" />
        <div className="hero__grid" />
      </div>

      <div className="hero__inner">
        <motion.div
          className="hero__content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.21, 0.7, 0.3, 1] }}
        >
          <div className="hero__badge">
            <span className="hero__badge-pulse" />
            {t(ui.hero.openToWork)}
          </div>

          <p className="hero__hello">{t(ui.hero.hello)}</p>
          <h1 className="hero__name">
            <span className="hero__name-gradient">{t(profile.name)}</span>
          </h1>

          <div className="hero__role">
            <span className="hero__role-prefix">&gt;_</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                className="hero__role-text"
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                transition={{ duration: 0.4 }}
              >
                {t(profile.roles[roleIndex])}
              </motion.span>
            </AnimatePresence>
          </div>

          <p className="hero__tagline">{t(profile.tagline)}</p>

          <div className="hero__actions">
            <a className="btn btn--primary" href={profile.cv} download={profile.cvFileName}>
              <DownloadIcon />
              {t(ui.hero.downloadCV)}
            </a>
            <button className="btn btn--ghost" onClick={() => scrollToSection('contact')}>
              {t(ui.hero.contactMe)}
            </button>
          </div>

          <div className="hero__socials">
            {socials.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="hero__social">
                <Icon />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hero__photo"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.21, 0.7, 0.3, 1] }}
        >
          <PhotoFrame />
        </motion.div>
      </div>

      <motion.button
        className="hero__scroll"
        onClick={() => scrollToSection('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="hero__scroll-line" />
        {t(ui.hero.scrollDown)}
      </motion.button>
    </section>
  )
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}
