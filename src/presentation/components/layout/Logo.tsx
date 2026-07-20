import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/cn'

import { LogoMark, type LogoProps } from './LogoMark'

/** Brand mark + app name — links back to home. */
export function Logo({ variant = 'default' }: LogoProps) {
  const { t } = useTranslation()
  const onPrimary = variant === 'onPrimary'

  return (
    <Link
      to="/"
      className={cn(
        'flex items-center gap-2.5 transition-opacity hover:opacity-80',
        onPrimary ? 'text-primary-foreground' : 'text-primary',
      )}
      aria-label={t('app.name')}
    >
      <LogoMark
        className={cn(
          'size-7 shrink-0 sm:size-8',
          onPrimary ? 'text-secondary' : 'text-secondary',
        )}
      />

      <span
        className={cn(
          'truncate text-lg font-semibold tracking-tight sm:text-xl',
          onPrimary ? 'text-primary-foreground' : 'text-primary',
        )}
      >
        {t('app.name')}
      </span>
    </Link>
  )
}
