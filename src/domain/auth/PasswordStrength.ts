/** Password security levels used for signup validation and UI feedback. */
export type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong'

/** Minimum accepted strength when creating an account. */
export const MIN_SIGNUP_PASSWORD_STRENGTH: PasswordStrength = 'medium'

const STRENGTH_RANK: Record<PasswordStrength, number> = {
  empty: 0,
  weak: 1,
  medium: 2,
  strong: 3,
}

/**
 * Scores password against the signup hint rules:
 * 8+ chars with upper, lower, number, and symbol → medium;
 * 12+ chars with all four classes → strong.
 */
export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) return 'empty'

  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasDigit = /\d/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)
  const varietyCount = [hasLower, hasUpper, hasDigit, hasSymbol].filter(
    Boolean,
  ).length

  if (password.length >= 12 && varietyCount === 4) return 'strong'

  if (password.length >= 8 && varietyCount === 4) return 'medium'

  return 'weak'
}

export function passwordStrengthFillCount(level: PasswordStrength): number {
  if (level === 'weak') return 1
  if (level === 'medium') return 2
  if (level === 'strong') return 3
  return 0
}

export function meetsMinPasswordStrength(password: string): boolean {
  const level = evaluatePasswordStrength(password)
  return STRENGTH_RANK[level] >= STRENGTH_RANK[MIN_SIGNUP_PASSWORD_STRENGTH]
}

export function passwordStrengthLabelKey(level: PasswordStrength): string {
  return `auth.passwordStrength.${level}`
}
