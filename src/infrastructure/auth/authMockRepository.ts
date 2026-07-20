import type { AuthSession } from '@/domain/auth/AuthSession'
import type { GoogleAuthRequest } from '@/domain/auth/GoogleAuthRequest'
import type { LoginCredentials } from '@/domain/auth/LoginCredentials'
import { normalizeLoginCredentials } from '@/domain/auth/LoginCredentials'
import type { SignupCredentials } from '@/domain/auth/SignupCredentials'
import {
  normalizeSignupCredentials,
  validateSignupAccountType,
} from '@/domain/auth/SignupCredentials'
import { mockLatency } from '@/infrastructure/mock/mockFetch'
import {
  mockLoginWithPassword,
  mockRestoreSessionFromToken,
  mockSignInWithGoogle,
  mockSignUpWithGoogle,
  mockSignupWithPassword,
} from '@/infrastructure/mock/mockStore'

function assertGoogleToken(
  request: Pick<GoogleAuthRequest, 'idToken' | 'accessToken'>,
): void {
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

  await mockLatency()
  return mockLoginWithPassword(normalized.identifier, normalized.password)
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

  await mockLatency()
  return mockSignupWithPassword({
    accountType: normalized.accountType,
    username: normalized.username,
    email: normalized.email,
    password: normalized.password,
  })
}

export async function signInWithGoogle(
  request: Pick<GoogleAuthRequest, 'idToken' | 'accessToken'>,
): Promise<AuthSession> {
  assertGoogleToken(request)
  await mockLatency()
  return mockSignInWithGoogle()
}

export async function signUpWithGoogle(
  request: GoogleAuthRequest,
): Promise<AuthSession> {
  assertGoogleToken(request)

  const accountTypeError = validateSignupAccountType(request.accountType ?? '')
  if (accountTypeError || !request.accountType) {
    throw new Error(accountTypeError ?? 'auth.signup.errors.accountTypeRequired')
  }

  await mockLatency()
  return mockSignUpWithGoogle(request.accountType)
}

export async function restoreSessionFromToken(
  accessToken: string,
): Promise<AuthSession | null> {
  await mockLatency()
  return mockRestoreSessionFromToken(accessToken)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function logoutFromApi(_accessToken: string): Promise<void> {
  await mockLatency()
}
