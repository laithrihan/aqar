import { useQuery } from '@tanstack/react-query'

import type { Listing } from '@/domain/listing/Listing'
import { fetchAllListings } from '@/infrastructure/listing/listingsRepository'
import type { ListingFeatureConfig } from '@/presentation/features/listings/listingFeature'

/** Shared cache key — every listing consumer reads from a single dataset. */
export const listingsQueryKey = ['listings'] as const

/** Loads every listing once (rent + sale). */
export function useAllListings() {
  return useQuery({
    queryKey: listingsQueryKey,
    queryFn: fetchAllListings,
  })
}

/** Loads the listings for a given feature (rent or buy), filtered by purpose. */
export function useListings(config: ListingFeatureConfig) {
  return useQuery({
    queryKey: listingsQueryKey,
    queryFn: fetchAllListings,
    select: (listings: Listing[]) =>
      listings.filter((listing) => listing.purpose === config.purpose),
  })
}
