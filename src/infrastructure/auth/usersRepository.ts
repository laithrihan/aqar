import type { StoredUser, UsersMockResponse } from '@/domain/auth/StoredUser'
import { normalizeEmail } from '@/domain/auth/StoredUser'

/**
 * Mock user registry: seed JSON + localStorage overlays for new/changed users.
 * Email is the unique key across password and OAuth providers.
 *
 * Only overlays are persisted — seed rows stay in `/mock/users.json` so seed
 * updates keep applying until a local change touches that email.
 */

const USERS_URL = '/mock/users.json'
const LOCAL_USERS_KEY = 'aqar-registered-users'

let seedByEmail: Map<string, StoredUser> | null = null
let overlayByEmail: Map<string, StoredUser> | null = null
let memoryUsers: StoredUser[] | null = null
let loadPromise: Promise<StoredUser[]> | null = null

function normalizeUser(user: StoredUser): StoredUser {
  return {
    ...user,
    email: normalizeEmail(user.email),
    username: user.username.trim().toLowerCase(),
  }
}

function readLocalOverlays(): StoredUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredUser[]
    return Array.isArray(parsed) ? parsed.map(normalizeUser) : []
  } catch {
    return []
  }
}

function writeLocalOverlays(users: StoredUser[]): void {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
}

function rebuildMemory(): StoredUser[] {
  const byEmail = new Map(seedByEmail ?? [])

  for (const [email, user] of overlayByEmail ?? []) {
    byEmail.set(email, user)
  }

  memoryUsers = Array.from(byEmail.values())
  return memoryUsers
}

/** Keep overlays that are local-only or that diverge from the seed snapshot. */
function isOverlayNeeded(
  overlay: StoredUser,
  seed: StoredUser | undefined,
): boolean {
  if (!seed) return true

  return (
    seed.id !== overlay.id ||
    seed.username !== overlay.username ||
    seed.name !== overlay.name ||
    seed.picture !== overlay.picture ||
    seed.accountType !== overlay.accountType ||
    seed.passwordHash !== overlay.passwordHash ||
    seed.googleSub !== overlay.googleSub ||
    seed.providers.length !== overlay.providers.length ||
    seed.providers.some((provider, index) => provider !== overlay.providers[index])
  )
}

async function fetchSeedUsers(): Promise<StoredUser[]> {
  const response = await fetch(USERS_URL)
  if (!response.ok) {
    throw new Error('auth.errors.generic')
  }

  const data = (await response.json()) as UsersMockResponse
  return Array.isArray(data.users) ? data.users.map(normalizeUser) : []
}

/** Loads seed + local overlays once, then serves from memory. */
export async function loadUsers(): Promise<StoredUser[]> {
  if (memoryUsers) return memoryUsers
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    const seed = await fetchSeedUsers()
    seedByEmail = new Map(seed.map((user) => [user.email, user]))

    const prunedOverlays = readLocalOverlays().filter((user) =>
      isOverlayNeeded(user, seedByEmail?.get(user.email)),
    )
    overlayByEmail = new Map(
      prunedOverlays.map((user) => [user.email, user]),
    )

    // Drop legacy full-registry dumps that only duplicated the seed.
    writeLocalOverlays(prunedOverlays)

    return rebuildMemory()
  })()

  try {
    return await loadPromise
  } finally {
    loadPromise = null
  }
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  const users = await loadUsers()
  return users.find((user) => user.id === id) ?? null
}

export async function findUserByEmail(
  email: string,
): Promise<StoredUser | null> {
  const users = await loadUsers()
  const normalized = normalizeEmail(email)
  return users.find((user) => user.email === normalized) ?? null
}

export async function findUserByUsername(
  username: string,
): Promise<StoredUser | null> {
  const users = await loadUsers()
  const normalized = username.trim().toLowerCase()
  return users.find((user) => user.username === normalized) ?? null
}

export async function findUserByIdentifier(
  identifier: string,
): Promise<StoredUser | null> {
  const trimmed = identifier.trim()
  if (trimmed.includes('@')) {
    return findUserByEmail(trimmed)
  }
  return findUserByUsername(trimmed)
}

/**
 * Upserts a user by email and persists only the local overlay for that email.
 * Seed snapshots are never rewritten into localStorage.
 */
export async function upsertUser(user: StoredUser): Promise<StoredUser> {
  await loadUsers()

  const nextUser = normalizeUser(user)
  const overlays = overlayByEmail ?? new Map<string, StoredUser>()
  overlays.set(nextUser.email, nextUser)
  overlayByEmail = overlays

  writeLocalOverlays(Array.from(overlays.values()))
  rebuildMemory()
  return nextUser
}

export function createUserId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `user-${crypto.randomUUID()}`
  }
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}
