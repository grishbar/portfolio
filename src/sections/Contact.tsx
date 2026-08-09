import { useState } from 'react'
import type { FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { motion } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import { Reveal } from '../components/Reveal'
import profile from '../data/profile.json'
import ui from '../data/ui.json'
import { GithubIcon, LinkedinIcon, TelegramIcon, MailIcon, PhoneIcon, PinIcon, PlaneIcon } from '../components/icons'

// EmailJS credentials come from the .env file (see README).
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export function Contact() {
  const { t } = useI18n()
  const [status, setStatus] = useState<FormStatus>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')

    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
      setStatus('sending')
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          { from_name: name, from_email: email, message },
          { publicKey: EMAILJS_PUBLIC_KEY },
        )
        setStatus('success')
        form.reset()
        return
      } catch {
        setStatus('error')
      }
    } else {
      setStatus('error')
    }

    // Fallback: open the visitor's email client with the message pre-filled.
    const subject = encodeURIComponent(`Portfolio contact from ${name}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    window.location.href = `mailto:${profile.contacts.email}?subject=${subject}&body=${body}`
  }

  const directContacts = [
    { Icon: MailIcon, label: profile.contacts.email, href: `mailto:${profile.contacts.email}` },
    { Icon: PhoneIcon, label: profile.contacts.phone, href: `tel:${profile.contacts.phone.replace(/[^+\d]/g, '')}` },
    { Icon: TelegramIcon, label: 'Telegram', href: profile.contacts.telegram },
    { Icon: GithubIcon, label: 'GitHub', href: profile.contacts.github },
    { Icon: LinkedinIcon, label: 'LinkedIn', href: profile.contacts.linkedin },
  ]

  return (
    <section className="section contact" id="contact">
      <div className="section__inner">
        <Reveal>
          <p className="section__kicker">{t(ui.contact.kicker)}</p>
          <h2 className="section__title">{t(ui.contact.title)}</h2>
          <p className="section__subtitle">{t(ui.contact.subtitle)}</p>
        </Reveal>

        <div className="contact__grid">
          <Reveal className="contact__form-wrap">
            <form className="contact-form" onSubmit={handleSubmit}>
              <label className="contact-form__field">
                <span>{t(ui.contact.form.name)}</span>
                <input name="name" type="text" required placeholder={t(ui.contact.form.namePlaceholder)} />
              </label>
              <label className="contact-form__field">
                <span>{t(ui.contact.form.email)}</span>
                <input name="email" type="email" required placeholder={t(ui.contact.form.emailPlaceholder)} />
              </label>
              <label className="contact-form__field">
                <span>{t(ui.contact.form.message)}</span>
                <textarea name="message" required rows={5} placeholder={t(ui.contact.form.messagePlaceholder)} />
              </label>

              <motion.button
                type="submit"
                className="btn btn--primary contact-form__submit"
                disabled={status === 'sending'}
                whileTap={{ scale: 0.97 }}
              >
                {status === 'sending' ? t(ui.contact.form.sending) : t(ui.contact.form.send)}
              </motion.button>

              {status === 'success' && <p className="contact-form__status contact-form__status--ok">{t(ui.contact.form.success)}</p>}
              {status === 'error' && <p className="contact-form__status contact-form__status--err">{t(ui.contact.form.error)}</p>}
            </form>
          </Reveal>

          <Reveal delay={0.12} className="contact__direct">
            <p className="contact__or">{t(ui.contact.or)}</p>
            <ul className="contact__list">
              {directContacts.map(({ Icon, label, href }) => (
                <li key={label}>
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" data-cursor="hover">
                    <Icon />
                    <span>{label}</span>
                  </a>
                </li>
              ))}
              <li className="contact__location">
                <PinIcon />
                <span>{t(profile.contacts.location)}</span>
              </li>
              {'relocation' in profile.contacts && profile.contacts.relocation && (
                <li className="contact__location contact__relocation">
                  <PlaneIcon />
                  <span>{t(profile.contacts.relocation)}</span>
                </li>
              )}
            </ul>

            <a className="btn btn--ghost contact__cv" href={profile.cv} download={profile.cvFileName}>
              {t(ui.hero.downloadCV)}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
