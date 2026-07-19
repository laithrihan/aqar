import { useQuery } from '@tanstack/react-query'

import { buildBentoColumnsFromListings } from '@/domain/home/buildBentoColumnsFromListings'
import { fetchListings } from '@/infrastructure/listing/listingsRepository'
import { rentListingFeature } from '@/presentation/features/listings/listingFeature'

/** Loads bento columns from the same rent listings used across the app. */
export function useBentoHomesColumns() {
  return useQuery({
    queryKey: rentListingFeature.queryKey,
    queryFn: () => fetchListings(rentListingFeature.dataUrl),
    select: buildBentoColumnsFromListings,
  })
}
