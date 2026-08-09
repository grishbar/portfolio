import { useI18n } from '../lib/i18n'
import { Reveal } from '../components/Reveal'
import profile from '../data/profile.json'
import ui from '../data/ui.json'

export function Education() {
  const { t } = useI18n()

  return (
    <section className="section education" id="education">
      <div className="section__inner">
        <Reveal>
          <p className="section__kicker">{t(ui.education.kicker)}</p>
          <h2 className="section__title">{t(ui.education.title)}</h2>
        </Reveal>

        <div className="education__grid">
          {profile.education.map((edu, i) => (
            <Reveal key={i} className="education-card" delay={0.05}>
              <span className="education-card__period">{edu.period}</span>
              <h3>{t(edu.university)}</h3>
              <p className="education-card__degree">{t(edu.degree)}</p>
              <p className="education-card__faculty">
                {t(edu.faculty)} · {t(edu.location)}
              </p>
            </Reveal>
          ))}

          <Reveal className="education-card education-card--langs" delay={0.15}>
            <h3>{t(ui.education.langTitle)}</h3>
            <ul className="education-card__langs">
              {profile.spokenLanguages.map((lang, i) => (
                <li key={i}>
                  <span>{t(lang.name)}</span>
                  <span className="education-card__lang-level">{t(lang.level)}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
