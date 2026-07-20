import type { AuthSession, AuthUser } from '@/domain/auth/AuthSession'
import type { SignupAccountType } from '@/domain/auth/SignupCredentials'
import type { OwnerProperty } from '@/domain/owner/OwnerProperty'

const USERS_KEY = 'aqar-mock-users'
const SAVED_KEY = 'aqar-mock-saved'
const OWNER_KEY = 'aqar-mock-owner-properties'
const TOKEN_PREFIX = 'mock-token:'

type MockUserRecord = {
  id: string
  email: string
  username: string
  name: string
  password: string
  accountType: SignupAccountType
  provider: AuthUser['provider']
  providers: AuthUser['provider'][]
  picture?: string
}

const SEED_USERS: MockUserRecord[] = [
  {
    id: 'user-demo',
    email: 'demo@aqar.local',
    username: 'demo',
    name: 'Demo User',
    password: 'Demo123!',
    accountType: 'user',
    provider: 'password',
    providers: ['password'],
  },
  {
    id: 'owner-demo',
    email: 'owner@aqar.local',
    username: 'owner',
    name: 'Demo Owner',
    password: 'Demo123!',
    accountType: 'owner',
    provider: 'password',
    providers: ['password'],
  },
]

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function ensureUsers(): MockUserRecord[] {
  const existing = readJson<MockUserRecord[] | null>(USERS_KEY, null)
  if (existing && existing.length > 0) return existing
  writeJson(USERS_KEY, SEED_USERS)
  return [...SEED_USERS]
}

function toAuthUser(record: MockUserRecord): AuthUser {
  return {
    id: record.id,
    email: record.email,
    name: record.name,
    picture: record.picture,
    accountType: record.accountType,
    provider: record.provider,
    providers: record.providers,
  }
}

function buildSession(record: MockUserRecord): AuthSession {
  return {
    user: toAuthUser(record),
    accessToken: `${TOKEN_PREFIX}${record.id}`,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
  }
}

export function mockFindUserByIdentifier(
  identifier: string,
): MockUserRecord | null {
  const normalized = identifier.trim().toLowerCase()
  return (
    ensureUsers().find(
      (user) =>
        user.email.toLowerCase() === normalized ||
        user.username.toLowerCase() === normalized,
    ) ?? null
  )
}

export function mockLoginWithPassword(
  identifier: string,
  password: string,
): AuthSession {
  const user = mockFindUserByIdentifier(identifier)
  if (!user || user.password !== password) {
    throw new Error('auth.errors.invalidCredentials')
  }
  return buildSession(user)
}

export function mockSignupWithPassword(input: {
  accountType: SignupAccountType
  username: string
  email: string
  password: string
}): AuthSession {
  const users = ensureUsers()
  const email = input.email.trim().toLowerCase()
  const username = input.username.trim()

  if (users.some((user) => user.email === email)) {
    throw new Error('auth.errors.emailAlreadyRegistered')
  }
  if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('auth.errors.usernameAlreadyTaken')
  }

  const record: MockUserRecord = {
    id: `user-${crypto.randomUUID()}`,
    email,
    username,
    name: username,
    password: input.password,
    accountType: input.accountType,
    provider: 'password',
    providers: ['password'],
  }

  writeJson(USERS_KEY, [...users, record])
  return buildSession(record)
}

export function mockSignInWithGoogle(): AuthSession {
  const users = ensureUsers()
  let record = users.find((user) => user.provider === 'google')
  if (!record) {
    record = {
      id: 'user-google',
      email: 'google.user@aqar.local',
      username: 'google.user',
      name: 'Google User',
      password: '',
      accountType: 'user',
      provider: 'google',
      providers: ['google'],
      picture: undefined,
    }
    writeJson(USERS_KEY, [...users, record])
  }
  return buildSession(record)
}

export function mockSignUpWithGoogle(
  accountType: SignupAccountType,
): AuthSession {
  const users = ensureUsers()
  const record: MockUserRecord = {
    id: `user-google-${crypto.randomUUID()}`,
    email: `google.${Date.now()}@aqar.local`,
    username: `google_${Date.now()}`,
    name: 'Google User',
    password: '',
    accountType,
    provider: 'google',
    providers: ['google'],
  }
  writeJson(USERS_KEY, [...users, record])
  return buildSession(record)
}

export function mockRestoreSessionFromToken(
  accessToken: string,
): AuthSession | null {
  if (!accessToken.startsWith(TOKEN_PREFIX)) return null
  const userId = accessToken.slice(TOKEN_PREFIX.length)
  const user = ensureUsers().find((record) => record.id === userId)
  return user ? buildSession(user) : null
}

export function mockGetSavedListingIds(userId: string): string[] {
  const all = readJson<Record<string, string[]>>(SAVED_KEY, {})
  return all[userId] ?? []
}

export function mockSetSavedListingIds(
  userId: string,
  listingIds: string[],
): string[] {
  const all = readJson<Record<string, string[]>>(SAVED_KEY, {})
  all[userId] = listingIds
  writeJson(SAVED_KEY, all)
  return listingIds
}

export function mockToggleSavedListing(
  userId: string,
  listingId: string,
): string[] {
  const current = mockGetSavedListingIds(userId)
  const next = current.includes(listingId)
    ? current.filter((id) => id !== listingId)
    : [...current, listingId]
  return mockSetSavedListingIds(userId, next)
}

export function mockRemoveSavedListing(
  userId: string,
  listingId: string,
): string[] {
  const next = mockGetSavedListingIds(userId).filter((id) => id !== listingId)
  return mockSetSavedListingIds(userId, next)
}

export function mockGetOwnerProperties(ownerUserId: string): OwnerProperty[] {
  const all = readJson<Record<string, OwnerProperty[]>>(OWNER_KEY, {})
  return all[ownerUserId] ?? []
}

export function mockSetOwnerProperties(
  ownerUserId: string,
  properties: OwnerProperty[],
): OwnerProperty[] {
  const all = readJson<Record<string, OwnerProperty[]>>(OWNER_KEY, {})
  all[ownerUserId] = properties
  writeJson(OWNER_KEY, all)
  return properties
}
