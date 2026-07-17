import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/** Brand mark + app name — links back to home. */
export function Logo() {
  const { t } = useTranslation()

  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 text-primary transition-opacity hover:opacity-80"
      aria-label={t('app.name')}
    >
      {/* Simple house mark — replace with brand SVG when available */}
      <svg
        className="size-8 shrink-0 text-secondary"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M4 14.5L16 5l12 9.5V27a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V14.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12 28V18h8v10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      <span className="text-xl font-semibold tracking-tight text-primary">
        {t('app.name')}
      </span>
    </Link>
  )
}
