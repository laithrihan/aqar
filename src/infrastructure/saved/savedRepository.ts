import type {
  SavedListingsMockResponse,
  SavedListingsRecord,
} from '@/domain/saved/SavedListing'
import { toggleSavedListingId } from '@/domain/saved/SavedListing'

/**
 * Mock saved-listings store: seed JSON + localStorage overlays per user.
 * Swap fetch/persist for real API calls when the backend is ready.
 */

const SAVED_URL = '/mock/saved-listings.json'
const LOCAL_SAVED_KEY = 'aqar-saved-listings'

let seedByUserId: Map<string, SavedListingsRecord> | null = null
let overlayByUserId: Map<string, SavedListingsRecord> | null = null
let loadPromise: Promise<void> | null = null

function normalizeRecord(record: SavedListingsRecord): SavedListingsRecord {
  return {
    userId: record.userId,
    listingIds: Array.from(new Set(record.listingIds)),
    updatedAt: record.updatedAt || new Date().toISOString(),
  }
}

function readLocalOverlays(): SavedListingsRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_SAVED_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedListingsRecord[]
    return Array.isArray(parsed) ? parsed.map(normalizeRecord) : []
  } catch {
    return []
  }
}

function writeLocalOverlays(records: SavedListingsRecord[]): void {
  localStorage.setItem(LOCAL_SAVED_KEY, JSON.stringify(records))
}

function getMergedRecord(userId: string): SavedListingsRecord {
  const overlay = overlayByUserId?.get(userId)
  if (overlay) return overlay

  const seed = seedByUserId?.get(userId)
  if (seed) return seed

  return {
    userId,
    listingIds: [],
    updatedAt: new Date(0).toISOString(),
  }
}

async function ensureLoaded(): Promise<void> {
  if (seedByUserId && overlayByUserId) return
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    const response = await fetch(SAVED_URL)
    if (!response.ok) {
      throw new Error('saved.errors.loadFailed')
    }

    const data = (await response.json()) as SavedListingsMockResponse
    const seedRows = Array.isArray(data.saved) ? data.saved : []

    seedByUserId = new Map(
      seedRows.map((row) => [row.userId, normalizeRecord(row)]),
    )
    overlayByUserId = new Map(
      readLocalOverlays().map((row) => [row.userId, normalizeRecord(row)]),
    )
  })()

  try {
    await loadPromise
  } finally {
    loadPromise = null
  }
}

export async function fetchSavedListingIds(
  userId: string,
): Promise<string[]> {
  await ensureLoaded()
  return [...getMergedRecord(userId).listingIds]
}


export async function toggleSavedListing(
  userId: string,
  listingId: string,
): Promise<string[]> {
  await ensureLoaded()

  const current = getMergedRecord(userId)
  const nextIds = toggleSavedListingId(current.listingIds, listingId)
  const nextRecord: SavedListingsRecord = {
    userId,
    listingIds: nextIds,
    updatedAt: new Date().toISOString(),
  }

  const overlays = overlayByUserId ?? new Map<string, SavedListingsRecord>()
  overlays.set(userId, nextRecord)
  overlayByUserId = overlays
  writeLocalOverlays(Array.from(overlays.values()))

  return nextIds
}

export async function removeSavedListing(
  userId: string,
  listingId: string,
): Promise<string[]> {
  await ensureLoaded()

  const current = getMergedRecord(userId)
  if (!current.listingIds.includes(listingId)) {
    return [...current.listingIds]
  }

  return toggleSavedListing(userId, listingId)
}
