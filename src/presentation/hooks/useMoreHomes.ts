import { selectMoreHomes } from '@/domain/property/selectMoreHomes'
import { rentListingFeature } from '@/presentation/features/listings/listingFeature'
import { useListings } from '@/presentation/hooks/useListings'

export function useMoreHomes(propertyId: string | undefined, limit = 4) {
  const listingsQuery = useListings(rentListingFeature)

  const homes =
    propertyId && listingsQuery.data
      ? selectMoreHomes(listingsQuery.data, propertyId, limit)
      : []

  return {
    data: homes,
    isPending: listingsQuery.isPending,
    isError: listingsQuery.isError,
  }
}
