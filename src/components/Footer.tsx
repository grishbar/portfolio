import { useI18n } from '../lib/i18n'
import ui from '../data/ui.json'

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="footer">
      <p>{t(ui.footer.madeWith)}</p>
      <p className="footer__updated">{t(ui.footer.lastUpdated)}</p>
    </footer>
  )
}
