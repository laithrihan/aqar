import { useTranslation } from 'react-i18next'

import {
  evaluatePasswordStrength,
  passwordStrengthFillCount,
  passwordStrengthLabelKey,
} from '@/domain/auth/PasswordStrength'
import { cn } from '@/shared/lib/cn'

type PasswordStrengthMeterProps = {
  password: string
}

const FILL_COLOR = {
  weak: 'bg-red-500',
  medium: 'bg-amber-500',
  strong: 'bg-emerald-500',
} as const

const LABEL_COLOR = {
  weak: 'text-red-600',
  medium: 'text-amber-600',
  strong: 'text-emerald-600',
} as const


export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { t } = useTranslation()
  const level = evaluatePasswordStrength(password ?? '')

  if (level === 'empty') return null

  const filled = passwordStrengthFillCount(level)
  const fillColor = FILL_COLOR[level]
  const labelColor = LABEL_COLOR[level]

  return (
    <div
      className="flex flex-col gap-1.5 pt-1"
      role="status"
      aria-live="polite"
      aria-label={t(passwordStrengthLabelKey(level))}
    >
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-200',
              index < filled ? fillColor : 'bg-border',
            )}
          />
        ))}
      </div>
      <p className={cn('text-xs font-semibold', labelColor)}>
        {t(passwordStrengthLabelKey(level))}
      </p>
      <p className="text-xs text-muted-foreground">
        {t('auth.passwordStrength.hint')}
      </p>
    </div>
  )
}
