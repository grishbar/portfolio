import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Lang = 'en' | 'ru'
export type Localized = { en: string; ru: string }

interface I18nContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Resolve a { en, ru } object (or plain string) to the current language. */
  t: (value: Localized | string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const STORAGE_KEY = 'portfolio-lang'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'ru' || saved === 'en' ? saved : 'en'
  })

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (value: Localized | string) => (typeof value === 'string' ? value : value[lang]),
    [lang],
  )

  const ctx = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <I18nContext.Provider value={ctx}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
