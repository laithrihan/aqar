import type { AuthSession, AuthUser } from '@/domain/auth/AuthSession'
import type { GoogleAuthRequest } from '@/domain/auth/GoogleAuthRequest'
import type { LoginCredentials } from '@/domain/auth/LoginCredentials'
import { normalizeLoginCredentials } from '@/domain/auth/LoginCredentials'
import type { SignupCredentials } from '@/domain/auth/SignupCredentials'
import {
  normalizeSignupCredentials,
  validateSignupAccountType,
} from '@/domain/auth/SignupCredentials'
import type { StoredUser } from '@/domain/auth/StoredUser'
import { withLinkedProvider } from '@/domain/auth/StoredUser'
import {
  issueAccessToken,
  verifyAccessToken,
} from '@/infrastructure/auth/jwtService'
import {
  hashPassword,
  verifyPassword,
} from '@/infrastructure/auth/passwordHash'
import {
  createUserId,
  findUserByEmail,
  findUserById,
  findUserByIdentifier,
  findUserByUsername,
  upsertUser,
} from '@/infrastructure/auth/usersRepository'

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

function toAuthUser(
  stored: StoredUser,
  provider: AuthUser['provider'],
): AuthUser {
  return {
    id: stored.id,
    email: stored.email,
    name: stored.name,
    picture: stored.picture,
    accountType: stored.accountType,
    provider,
    providers: stored.providers,
  }
}

async function createSession(
  stored: StoredUser,
  provider: AuthUser['provider'],
): Promise<AuthSession> {
  const user = toAuthUser(stored, provider)
  const { accessToken, expiresAt } = await issueAccessToken({ user, provider })
  return { user, accessToken, expiresAt }
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

/**
 * Signs in with Google. Uses the existing account for that email when present
 * (linking Google if needed) so OAuth never creates a duplicate email.
 */
export async function signInWithGoogle(
  request: Pick<GoogleAuthRequest, 'accessToken'>,
): Promise<AuthSession> {
  if (!request.accessToken) {
    throw new Error('auth.errors.googleFailed')
  }

  const info = await fetchGoogleUserInfo(request.accessToken)
  await delay(MOCK_AUTH_DELAY_MS)

  const existing = await findUserByEmail(info.email)
  if (!existing) {
    throw new Error('auth.errors.accountNotFound')
  }

  const linked = withLinkedProvider(existing, 'google', {
    googleSub: info.sub,
    picture: info.picture ?? existing.picture,
    name: existing.name || info.name?.trim() || existing.email,
  })
  const saved = await upsertUser(linked)
  return createSession(saved, 'google')
}

/**
 * Signs up with Google. Rejects when the email already has an account —
 * including password-only accounts — to avoid duplicate email registration.
 */
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

  const existing = await findUserByEmail(info.email)
  if (existing) {
    if (existing.providers.includes('google')) {
      throw new Error('auth.errors.emailAlreadyRegistered')
    }
    // Password account already owns this email — do not create a second user.
    throw new Error('auth.errors.emailRegisteredWithPassword')
  }

  const usernameBase =
    info.email.split('@')[0]?.replace(/[^a-zA-Z0-9._-]/g, '') || 'google'
  const username = await ensureUniqueUsername(usernameBase)

  const created = await upsertUser({
    id: createUserId(),
    email: info.email,
    username,
    name: info.name?.trim() || username,
    picture: info.picture,
    accountType: request.accountType,
    providers: ['google'],
    googleSub: info.sub,
    createdAt: new Date().toISOString(),
  })

  return createSession(created, 'google')
}

async function ensureUniqueUsername(base: string): Promise<string> {
  const cleaned = base.toLowerCase().slice(0, 24) || 'user'
  let candidate = cleaned
  let attempt = 0

  while (await findUserByUsername(candidate)) {
    attempt += 1
    candidate = `${cleaned}${attempt}`
  }

  return candidate
}

/**
 * Password login against the mock user registry. Issues an app JWT on success.
 */
export async function loginWithPassword(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  const normalized = normalizeLoginCredentials(credentials)
  await delay(MOCK_AUTH_DELAY_MS)

  if (!normalized.identifier || !normalized.password) {
    throw new Error('auth.errors.generic')
  }

  const user = await findUserByIdentifier(normalized.identifier)
  if (!user || !user.providers.includes('password')) {
    throw new Error('auth.errors.invalidCredentials')
  }

  const passwordOk = await verifyPassword(
    normalized.password,
    user.passwordHash,
  )
  if (!passwordOk) {
    throw new Error('auth.errors.invalidCredentials')
  }

  return createSession(user, 'password')
}

/**
 * Password signup. Rejects duplicate email/username — including emails that
 * already belong to a Google-only account.
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

  const emailOwner = await findUserByEmail(normalized.email)
  if (emailOwner) {
    if (emailOwner.providers.includes('google')) {
      throw new Error('auth.errors.emailRegisteredWithGoogle')
    }
    throw new Error('auth.errors.emailAlreadyRegistered')
  }

  const usernameOwner = await findUserByUsername(normalized.username)
  if (usernameOwner) {
    throw new Error('auth.errors.usernameAlreadyTaken')
  }

  const passwordHash = await hashPassword(normalized.password)
  const created = await upsertUser({
    id: createUserId(),
    email: normalized.email,
    username: normalized.username,
    name: normalized.username,
    accountType: normalized.accountType,
    providers: ['password'],
    passwordHash,
    createdAt: new Date().toISOString(),
  })

  return createSession(created, 'password')
}

/**
 * Re-validates a persisted session JWT, then reloads the user from the mock
 * registry so deleted/updated accounts cannot stay signed in on stale claims.
 * Returns null when the token is missing, forged, expired, or the user is gone.
 */
export async function restoreSessionFromToken(
  accessToken: string,
): Promise<AuthSession | null> {
  const payload = await verifyAccessToken(accessToken)
  if (!payload) return null

  const stored =
    (await findUserById(payload.sub)) ?? (await findUserByEmail(payload.email))
  if (!stored) return null

  const provider = stored.providers.includes(payload.provider)
    ? payload.provider
    : stored.providers[0]
  if (!provider) return null

  // Keep the existing token; refresh profile fields from the registry.
  return {
    user: toAuthUser(stored, provider),
    accessToken,
    expiresAt: payload.exp * 1000,
  }
}
