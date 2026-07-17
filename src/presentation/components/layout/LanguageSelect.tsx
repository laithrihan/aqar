import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/cn'

const LANGUAGES = [
  { code: 'en', labelKey: 'language.en' },
  { code: 'ar', labelKey: 'language.ar' },
] as const

/** Globe icon for the language switcher. */
function LanguageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" strokeLinecap="round" />
      <path
        d="M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9s1.3-6.2 3.8-9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Language select — toggles between English and Arabic. */
export function LanguageSelect() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const activeCode = i18n.language.startsWith('ar') ? 'ar' : 'en'
  const activeLabel = t(
    activeCode === 'ar' ? 'language.ar' : 'language.en',
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const selectLanguage = (code: string) => {
    void i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('language.label')}
        onClick={() => setOpen((value) => !value)}
      >
        <LanguageIcon className="size-4 shrink-0" />
        <span>{activeLabel}</span>
        <svg
          className={cn('size-3.5 transition-transform', open && 'rotate-180')}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('language.label')}
          className="absolute start-0 top-full z-50 mt-2 min-w-[9rem] overflow-hidden rounded-md border border-border bg-background py-1 shadow-md"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code} role="option" aria-selected={activeCode === lang.code}>
              <button
                type="button"
                className={cn(
                  'flex w-full items-center px-3 py-2 text-start text-sm text-foreground transition-colors hover:bg-muted',
                  activeCode === lang.code && 'bg-muted font-semibold text-secondary',
                )}
                onClick={() => selectLanguage(lang.code)}
              >
                {t(lang.labelKey)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
