export type LoginCredentials = {
  identifier: string
  password: string
}

export function normalizeLoginCredentials(
  values: LoginCredentials,
): LoginCredentials {
  return {
    identifier: values.identifier.trim(),
    password: values.password,
  }
}

export function validateLoginCredentials(values: LoginCredentials): {
  valid: boolean
  errors: Partial<Record<keyof LoginCredentials, string>>
} {
  const normalized = normalizeLoginCredentials(values)
  const errors: Partial<Record<keyof LoginCredentials, string>> = {}

  if (!normalized.identifier) {
    errors.identifier = 'auth.login.errors.identifierRequired'
  }

  if (!normalized.password) {
    errors.password = 'auth.login.errors.passwordRequired'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}
