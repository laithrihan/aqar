/**
 * Per-user saved listing ids.
 * Persisted in the mock layer until a real favorites API exists.
 */

export type SavedListingsRecord = {
  userId: string
  listingIds: string[]
  updatedAt: string
}

export type SavedListingsMockResponse = {
  saved: SavedListingsRecord[]
}

/** Whether a listing id is already in the user's saved set. */
export function isListingSaved(
  listingIds: readonly string[],
  listingId: string,
): boolean {
  return listingIds.includes(listingId)
}

/** Returns a new id list with the listing toggled on or off. */
export function toggleSavedListingId(
  listingIds: readonly string[],
  listingId: string,
): string[] {
  if (listingIds.includes(listingId)) {
    return listingIds.filter((id) => id !== listingId)
  }
  return [...listingIds, listingId]
}

/** Keeps saved ids that still exist in the current listings catalog. */
export function resolveSavedListings<T extends { id: string }>(
  listings: readonly T[],
  savedIds: readonly string[],
): T[] {
  const byId = new Map(listings.map((listing) => [listing.id, listing]))
  return savedIds
    .map((id) => byId.get(id))
    .filter((listing): listing is T => listing !== undefined)
}
