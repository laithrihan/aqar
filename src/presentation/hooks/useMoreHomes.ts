import { selectMoreHomes } from '@/domain/property/selectMoreHomes'
import { useRentListings } from '@/presentation/hooks/useRentListings'

export function useMoreHomes(propertyId: string | undefined, limit = 4) {
  const listingsQuery = useRentListings()

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
