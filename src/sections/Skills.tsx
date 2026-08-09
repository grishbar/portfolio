import { motion } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import { Reveal } from '../components/Reveal'
import skills from '../data/skills.json'
import ui from '../data/ui.json'

export function Skills() {
  const { t } = useI18n()

  return (
    <section className="section skills" id="skills">
      <div className="section__inner">
        <Reveal>
          <p className="section__kicker">{t(ui.skills.kicker)}</p>
          <h2 className="section__title">{t(ui.skills.title)}</h2>
          <p className="section__subtitle">{t(ui.skills.subtitle)}</p>
        </Reveal>

        <div className="skills__grid">
          {skills.categories.map((category, ci) => (
            <Reveal
              key={category.id}
              delay={0.06 * ci}
              className={`skill-card ${'featured' in category && category.featured ? 'skill-card--featured' : ''}`}
            >
              <h3 className="skill-card__title">{t(category.title)}</h3>
              {'subtitle' in category && category.subtitle && (
                <p className="skill-card__subtitle">{t(category.subtitle)}</p>
              )}
              <ul className="skill-card__list">
                {category.skills.map((skill) => (
                  <li key={skill.name} className="skill-row" data-cursor="hover">
                    <div className="skill-row__top">
                      <span className="skill-row__name">{skill.name}</span>
                      {'note' in skill && skill.note && (
                        <span className="skill-row__note">{t(skill.note)}</span>
                      )}
                    </div>
                    <div className="skill-row__bar">
                      <motion.span
                        className="skill-row__fill"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 1.1, ease: [0.21, 0.7, 0.3, 1] }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <h3 className="skills__soft-title">{t(ui.skills.softTitle)}</h3>
          <div className="skills__soft">
            {skills.softSkills.map((skill, i) => (
              <motion.span
                key={i}
                className="tag tag--big"
                data-cursor="hover"
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.04 * i, duration: 0.4 }}
                whileHover={{ scale: 1.08, rotate: i % 2 === 0 ? 1.5 : -1.5 }}
              >
                {t(skill)}
              </motion.span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
