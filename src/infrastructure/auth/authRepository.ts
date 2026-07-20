import type { AuthSession } from '@/domain/auth/AuthSession'
import type { GoogleAuthRequest } from '@/domain/auth/GoogleAuthRequest'
import { buildGoogleAuthBody } from '@/domain/auth/GoogleAuthRequest'
import type { LoginCredentials } from '@/domain/auth/LoginCredentials'
import { normalizeLoginCredentials } from '@/domain/auth/LoginCredentials'
import type { SignupCredentials } from '@/domain/auth/SignupCredentials'
import {
  normalizeSignupCredentials,
  validateSignupAccountType,
} from '@/domain/auth/SignupCredentials'
import { apiFetch } from '@/infrastructure/api/apiClient'

function assertGoogleToken(request: Pick<GoogleAuthRequest, 'idToken' | 'accessToken'>): void {
  if (!request.idToken && !request.accessToken) {
    throw new Error('auth.errors.googleFailed')
  }
}

export async function loginWithPassword(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  const normalized = normalizeLoginCredentials(credentials)

  if (!normalized.identifier || !normalized.password) {
    throw new Error('auth.errors.generic')
  }

  return apiFetch<AuthSession>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      identifier: normalized.identifier,
      password: normalized.password,
    }),
  })
}

export async function signupWithPassword(
  credentials: SignupCredentials,
): Promise<AuthSession> {
  const normalized = normalizeSignupCredentials(credentials)

  if (
    !normalized.accountType ||
    !normalized.email ||
    !normalized.username ||
    !normalized.password
  ) {
    throw new Error('auth.errors.generic')
  }

  return apiFetch<AuthSession>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      accountType: normalized.accountType,
      username: normalized.username,
      email: normalized.email,
      password: normalized.password,
      confirmPassword: normalized.confirmPassword,
    }),
  })
}

export async function signInWithGoogle(
  request: Pick<GoogleAuthRequest, 'idToken' | 'accessToken'>,
): Promise<AuthSession> {
  assertGoogleToken(request)

  return apiFetch<AuthSession>('/auth/google/signin', {
    method: 'POST',
    body: JSON.stringify(buildGoogleAuthBody(request)),
  })
}

export async function signUpWithGoogle(
  request: GoogleAuthRequest,
): Promise<AuthSession> {
  assertGoogleToken(request)

  const accountTypeError = validateSignupAccountType(request.accountType ?? '')
  if (accountTypeError || !request.accountType) {
    throw new Error(accountTypeError ?? 'auth.signup.errors.accountTypeRequired')
  }

  return apiFetch<AuthSession>('/auth/google/signup', {
    method: 'POST',
    body: JSON.stringify(buildGoogleAuthBody(request)),
  })
}

/** Validates a persisted token with the backend and returns a fresh session. */
export async function restoreSessionFromToken(
  accessToken: string,
): Promise<AuthSession | null> {
  try {
    return await apiFetch<AuthSession>('/auth/me', { token: accessToken })
  } catch {
    return null
  }
}

/** Invalidates the JWT on the backend (best-effort). */
export async function logoutFromApi(accessToken: string): Promise<void> {
  try {
    await apiFetch('/auth/logout', {
      method: 'POST',
      token: accessToken,
    })
  } catch {
    // Local session is cleared regardless.
  }
}
