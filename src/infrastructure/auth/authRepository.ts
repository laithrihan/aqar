import type { AuthSession, AuthUser } from '@/domain/auth/AuthSession'
import type { GoogleAuthRequest } from '@/domain/auth/GoogleAuthRequest'
import type { LoginCredentials } from '@/domain/auth/LoginCredentials'
import { normalizeLoginCredentials } from '@/domain/auth/LoginCredentials'
import type { SignupCredentials } from '@/domain/auth/SignupCredentials'
import {
  normalizeSignupCredentials,
  validateSignupAccountType,
} from '@/domain/auth/SignupCredentials'

type GoogleUserInfo = {
  sub: string
  email: string
  name?: string
  picture?: string
}

const MOCK_AUTH_DELAY_MS = 500

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetches the Google profile for a GIS access token.
 * Replace with a backend token exchange when the API is ready.
 */
export async function fetchGoogleUserInfo(
  accessToken: string,
): Promise<GoogleUserInfo> {
  const response = await fetch(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )

  if (!response.ok) {
    throw new Error('auth.errors.googleFailed')
  }

  const data = (await response.json()) as Partial<GoogleUserInfo>

  if (!data.sub || !data.email) {
    throw new Error('auth.errors.googleFailed')
  }

  return {
    sub: data.sub,
    email: data.email,
    name: data.name,
    picture: data.picture,
  }
}

function sessionFromGoogle(
  info: GoogleUserInfo,
  accessToken: string,
  accountType?: GoogleAuthRequest['accountType'],
): AuthSession {
  const user: AuthUser = {
    id: info.sub,
    email: info.email,
    name: info.name?.trim() || info.email,
    picture: info.picture,
    accountType,
    provider: 'google',
  }

  return { user, accessToken }
}

/**
 * Signs in with Google via access token + userinfo.
 * Swap for POST /auth/google when the backend exists.
 */
export async function signInWithGoogle(
  request: Pick<GoogleAuthRequest, 'accessToken'>,
): Promise<AuthSession> {
  if (!request.accessToken) {
    throw new Error('auth.errors.googleFailed')
  }

  const info = await fetchGoogleUserInfo(request.accessToken)
  await delay(MOCK_AUTH_DELAY_MS)
  return sessionFromGoogle(info, request.accessToken)
}

export async function signUpWithGoogle(
  request: GoogleAuthRequest,
): Promise<AuthSession> {
  if (!request.accessToken) {
    throw new Error('auth.errors.googleFailed')
  }

  const accountTypeError = validateSignupAccountType(request.accountType ?? '')
  if (accountTypeError || !request.accountType) {
    throw new Error(accountTypeError ?? 'auth.signup.errors.accountTypeRequired')
  }

  const info = await fetchGoogleUserInfo(request.accessToken)
  await delay(MOCK_AUTH_DELAY_MS)
  return sessionFromGoogle(info, request.accessToken, request.accountType)
}

/**
 * Mock password login until the API is ready.
 */
export async function loginWithPassword(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  const normalized = normalizeLoginCredentials(credentials)
  await delay(MOCK_AUTH_DELAY_MS)

  if (!normalized.identifier || !normalized.password) {
    throw new Error('auth.errors.generic')
  }

  const looksLikeEmail = normalized.identifier.includes('@')
  const email = looksLikeEmail
    ? normalized.identifier.toLowerCase()
    : `${normalized.identifier.toLowerCase()}@aqar.local`

  return {
    accessToken: `mock-password-${Date.now()}`,
    user: {
      id: `password-${normalized.identifier.toLowerCase()}`,
      email,
      name: normalized.identifier,
      provider: 'password',
    },
  }
}

/**
 * Mock password signup until the API is ready.
 */
export async function signupWithPassword(
  credentials: SignupCredentials,
): Promise<AuthSession> {
  const normalized = normalizeSignupCredentials(credentials)
  await delay(MOCK_AUTH_DELAY_MS)

  if (
    !normalized.accountType ||
    !normalized.email ||
    !normalized.username ||
    !normalized.password
  ) {
    throw new Error('auth.errors.generic')
  }

  return {
    accessToken: `mock-password-${Date.now()}`,
    user: {
      id: `password-${normalized.username.toLowerCase()}`,
      email: normalized.email,
      name: normalized.username,
      accountType: normalized.accountType,
      provider: 'password',
    },
  }
}
