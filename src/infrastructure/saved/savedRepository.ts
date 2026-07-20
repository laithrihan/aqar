import { apiFetch } from '@/infrastructure/api/apiClient'

type SavedListingsResponse = {
  listingIds: string[]
}

function requireAuthTokenError(code: string): never {
  throw new Error(code)
}

/** Loads saved listing ids for the authenticated user (JWT). */
export async function fetchSavedListingIds(
  _userId?: string,
): Promise<string[]> {
  const data = await apiFetch<SavedListingsResponse>('/me/saved-listings', {
    auth: true,
    errorFallback: 'saved.errors.loadFailed',
  })
  return data.listingIds ?? []
}

/** Toggles a listing in the authenticated user's saved set. */
export async function toggleSavedListing(
  _userId: string,
  listingId: string,
): Promise<string[]> {
  if (!listingId) {
    requireAuthTokenError('saved.errors.loadFailed')
  }

  const data = await apiFetch<SavedListingsResponse>(
    `/me/saved-listings/${encodeURIComponent(listingId)}/toggle`,
    {
      method: 'POST',
      auth: true,
      errorFallback: 'saved.errors.loadFailed',
    },
  )
  return data.listingIds ?? []
}

/** Removes a listing from the authenticated user's saved set. */
export async function removeSavedListing(
  _userId: string,
  listingId: string,
): Promise<string[]> {
  const data = await apiFetch<SavedListingsResponse>(
    `/me/saved-listings/${encodeURIComponent(listingId)}`,
    {
      method: 'DELETE',
      auth: true,
      errorFallback: 'saved.errors.loadFailed',
    },
  )
  return data.listingIds ?? []
}
