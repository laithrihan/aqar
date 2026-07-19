import { useQuery } from '@tanstack/react-query'

import { fetchListings } from '@/infrastructure/listing/listingsRepository'
import type { ListingFeatureConfig } from '@/presentation/features/listings/listingFeature'

/** Loads the listings for a given listing feature (rent or buy). */
export function useListings(config: ListingFeatureConfig) {
  return useQuery({
    queryKey: config.queryKey,
    queryFn: () => fetchListings(config.dataUrl),
  })
}
