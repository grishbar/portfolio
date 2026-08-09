import { useEffect, useState } from 'react'
import { useI18n } from '../lib/i18n'
import profile from '../data/profile.json'
import ui from '../data/ui.json'

/**
 * Photo slot with a rotating conic-gradient border.
 * Shows the photo from profile.json if the file exists, otherwise a stylish placeholder.
 * To add your photo: put it at assets/photo/me.jpeg (or change "photo" in profile.json).
 */
export function PhotoFrame() {
  const { t } = useI18n()
  const src = profile.photo
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setLoaded(false)
    setFailed(false)
  }, [src])

  return (
    <div className="photo-frame" data-cursor="hover">
      <div className="photo-frame__ring" aria-hidden />
      <div className="photo-frame__inner">
        {!failed && (
          <img
            key={src}
            src={src}
            alt={t(profile.name)}
            className={`photo-frame__img ${loaded ? 'photo-frame__img--visible' : ''}`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
        {(!loaded || failed) && (
          <div className="photo-frame__placeholder">
            <span className="photo-frame__initials">GB</span>
            <span className="photo-frame__soon">{t(ui.about.photoSoon)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
