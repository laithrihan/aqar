import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { isListingSaved } from '@/domain/saved/SavedListing'
import {
  fetchSavedListingIds,
  removeSavedListing,
  toggleSavedListing,
} from '@/infrastructure/saved/savedRepository'
import { useAuthStore } from '@/presentation/stores/authStore'

/** Cache key scoped to the signed-in user. */
export function savedListingsQueryKey(userId: string) {
  return ['saved-listings', userId] as const
}

/** Loads saved listing ids for the current session user. */
export function useSavedListingIds() {
  const userId = useAuthStore((s) => s.session?.user.id)

  return useQuery({
    queryKey: savedListingsQueryKey(userId ?? 'anonymous'),
    queryFn: () => fetchSavedListingIds(userId!),
    enabled: Boolean(userId),
    initialData: userId ? undefined : [],
  })
}

/** Whether a specific listing is saved by the current user. */
export function useIsListingSaved(listingId: string): boolean {
  const { data: savedIds = [] } = useSavedListingIds()
  return isListingSaved(savedIds, listingId)
}

/** Toggles save / unsave for a listing owned by the signed-in user. */
export function useToggleSavedListing() {
  const userId = useAuthStore((s) => s.session?.user.id)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (listingId: string) => {
      if (!userId) {
        throw new Error('saved.errors.signInRequired')
      }
      return toggleSavedListing(userId, listingId)
    },
    onSuccess: (listingIds) => {
      if (!userId) return
      queryClient.setQueryData(savedListingsQueryKey(userId), listingIds)
    },
  })
}

/** Removes a listing from the saved set (used by the saved houses table). */
export function useRemoveSavedListing() {
  const userId = useAuthStore((s) => s.session?.user.id)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (listingId: string) => {
      if (!userId) {
        throw new Error('saved.errors.signInRequired')
      }
      return removeSavedListing(userId, listingId)
    },
    onSuccess: (listingIds) => {
      if (!userId) return
      queryClient.setQueryData(savedListingsQueryKey(userId), listingIds)
    },
  })
}
