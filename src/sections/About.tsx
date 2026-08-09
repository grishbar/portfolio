import { motion } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import { Reveal } from '../components/Reveal'
import profile from '../data/profile.json'
import ui from '../data/ui.json'

export function About() {
  const { t } = useI18n()

  return (
    <section className="section about" id="about">
      <div className="section__inner">
        <Reveal>
          <p className="section__kicker">{t(ui.about.kicker)}</p>
          <h2 className="section__title">{t(profile.about.title)}</h2>
        </Reveal>

        <div className="about__grid">
          <div className="about__text">
            {profile.about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <p className="about__paragraph">{t(p)}</p>
              </Reveal>
            ))}
          </div>

          <div className="about__stats">
            {profile.stats.map((stat, i) => (
              <motion.div
                key={i}
                className="stat-card"
                data-cursor="hover"
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.21, 0.7, 0.3, 1] }}
                whileHover={{ y: -6 }}
              >
                <span className="stat-card__value">{stat.value}</span>
                <span className="stat-card__label">{t(stat.label)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
