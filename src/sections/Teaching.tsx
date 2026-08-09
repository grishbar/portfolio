import { useI18n } from '../lib/i18n'
import { Reveal } from '../components/Reveal'
import experience from '../data/experience.json'
import ui from '../data/ui.json'

export function Teaching() {
  const { t } = useI18n()
  const { activities } = experience

  return (
    <section className="section teaching" id="teaching">
      <div className="section__inner">
        <Reveal>
          <p className="section__kicker">{t(ui.teaching.kicker)}</p>
          <h2 className="section__title">{t(activities.title)}</h2>
          <p className="teaching__period">{t(activities.period)}</p>
        </Reveal>

        <div className="teaching__grid">
          {activities.items.map((item, i) => (
            <Reveal key={i} delay={0.08 * i} className="teaching-card">
              <span className="teaching-card__num">{String(i + 1).padStart(2, '0')}</span>
              <p>{t(item)}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="teaching__tags">
            {activities.tags.map((tag) => (
              <span key={tag} className="tag" data-cursor="hover">
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
