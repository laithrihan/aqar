import { meetsMinPasswordStrength } from './PasswordStrength'

export type SignupCredentials = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export type PasswordMatchStatus = 'idle' | 'match' | 'mismatch'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,30}$/

export function normalizeSignupCredentials(
  values: SignupCredentials,
): SignupCredentials {
  return {
    username: values.username.trim(),
    email: values.email.trim().toLowerCase(),
    password: values.password,
    confirmPassword: values.confirmPassword,
  }
}

/** Live status for the confirm-password field. Idle until the user types a confirmation. */
export function getPasswordMatchStatus(
  password: string,
  confirmPassword: string,
): PasswordMatchStatus {
  if (!confirmPassword) return 'idle'
  return password === confirmPassword ? 'match' : 'mismatch'
}

export function validateSignupCredentials(values: SignupCredentials): {
  valid: boolean
  errors: Partial<Record<keyof SignupCredentials, string>>
} {
  const normalized = normalizeSignupCredentials(values)
  const errors: Partial<Record<keyof SignupCredentials, string>> = {}

  if (!normalized.username) {
    errors.username = 'auth.signup.errors.usernameRequired'
  } else if (!USERNAME_PATTERN.test(normalized.username)) {
    errors.username = 'auth.signup.errors.usernameInvalid'
  }

  if (!normalized.email) {
    errors.email = 'auth.signup.errors.emailRequired'
  } else if (!EMAIL_PATTERN.test(normalized.email)) {
    errors.email = 'auth.signup.errors.emailInvalid'
  }

  if (!normalized.password) {
    errors.password = 'auth.signup.errors.passwordRequired'
  } else if (!meetsMinPasswordStrength(normalized.password)) {
    errors.password = 'auth.signup.errors.passwordWeak'
  }

  if (!normalized.confirmPassword) {
    errors.confirmPassword = 'auth.signup.errors.confirmRequired'
  } else if (
    getPasswordMatchStatus(normalized.password, normalized.confirmPassword) ===
    'mismatch'
  ) {
    errors.confirmPassword = 'auth.signup.errors.confirmMismatch'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}
