import { useAuthStore } from '@/presentation/stores/authStore'

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
  notFound: 'auth.errors.generic',
  forbidden: 'owner.errors.signInRequired',
}

const GOOGLE_ERROR_FIELDS = new Set([
  'access_token',
  'accessToken',
  'id_token',
  'idToken',
])

export function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') ?? ''
  if (!base) {
    throw new Error('auth.errors.generic')
  }
  return base
}

export function getAccessToken(): string | null {
  return useAuthStore.getState().session?.accessToken ?? null
}

function mapApiErrorCode(
  code?: string,
  errors?: Record<string, string[]>,
  fallback = 'auth.errors.generic',
): string {
  if (code === 'validationError' && errors) {
    const hasGoogleFieldError = Object.keys(errors).some((field) =>
      GOOGLE_ERROR_FIELDS.has(field),
    )
    if (hasGoogleFieldError) {
      return 'auth.errors.googleFailed'
    }
  }

  if (!code) return fallback
  return API_ERROR_KEYS[code] ?? fallback
}

type ApiFetchOptions = RequestInit & {
  token?: string | null
  /** When true, attach the current session JWT (required for protected routes). */
  auth?: boolean
  errorFallback?: string
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { token, auth, errorFallback = 'auth.errors.generic', ...init } = options
  const headers = new Headers(init.headers)

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const bearer = token ?? (auth ? getAccessToken() : null)
  if (auth && !bearer) {
    throw new Error('auth.errors.sessionExpired')
  }
  if (bearer) {
    headers.set('Authorization', `Bearer ${bearer}`)
  }

  let response: Response

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers,
    })
  } catch {
    throw new Error(errorFallback)
  }

  if (!response.ok) {
    let body: ApiErrorBody = {}
    try {
      body = (await response.json()) as ApiErrorBody
    } catch {
      // ignore non-JSON error bodies
    }

    if (body.code === 'notFound' && errorFallback !== 'auth.errors.generic') {
      throw new Error(errorFallback)
    }

    throw new Error(mapApiErrorCode(body.code, body.errors, errorFallback))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
