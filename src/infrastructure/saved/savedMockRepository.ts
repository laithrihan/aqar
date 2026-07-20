import { mockLatency } from '@/infrastructure/mock/mockFetch'
import {
  mockGetSavedListingIds,
  mockRemoveSavedListing,
  mockToggleSavedListing,
} from '@/infrastructure/mock/mockStore'
import { useAuthStore } from '@/presentation/stores/authStore'

function requireUserId(): string {
  const userId = useAuthStore.getState().session?.user.id
  if (!userId) {
    throw new Error('auth.errors.sessionExpired')
  }
  return userId
}

/** Loads saved listing ids from localStorage. */
export async function fetchSavedListingIds(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId?: string,
): Promise<string[]> {
  await mockLatency()
  return mockGetSavedListingIds(requireUserId())
}

/** Toggles a listing in the mock saved set. */
export async function toggleSavedListing(
  _userId: string,
  listingId: string,
): Promise<string[]> {
  if (!listingId) {
    throw new Error('saved.errors.loadFailed')
  }

  await mockLatency()
  return mockToggleSavedListing(requireUserId(), listingId)
}

/** Removes a listing from the mock saved set. */
export async function removeSavedListing(
  _userId: string,
  listingId: string,
): Promise<string[]> {
  await mockLatency()
  return mockRemoveSavedListing(requireUserId(), listingId)
}
