export type ApiErrorBody = {
  message?: string
  code?: string
  errors?: Record<string, string[]>
}

const API_ERROR_KEYS: Record<string, string> = {
  invalidCredentials: 'auth.errors.invalidCredentials',
  accountNotFound: 'auth.errors.accountNotFound',
  emailTaken: 'auth.errors.emailAlreadyRegistered',
  usernameTaken: 'auth.errors.usernameAlreadyTaken',
  emailRegisteredWithGoogle: 'auth.errors.emailRegisteredWithGoogle',
  emailRegisteredWithPassword: 'auth.errors.emailRegisteredWithPassword',
  unauthenticated: 'auth.errors.sessionExpired',
}

export function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') ?? ''
  if (!base) {
    throw new Error('auth.errors.generic')
  }
  return base
}

function mapApiErrorCode(code?: string): string {
  if (!code) return 'auth.errors.generic'
  return API_ERROR_KEYS[code] ?? 'auth.errors.generic'
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...init } = options
  const headers = new Headers(init.headers)

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers,
    })
  } catch {
    throw new Error('auth.errors.generic')
  }

  if (!response.ok) {
    let body: ApiErrorBody = {}
    try {
      body = (await response.json()) as ApiErrorBody
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(mapApiErrorCode(body.code))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
