import { selectMoreHomes } from '@/domain/property/selectMoreHomes'
import { useAllListings } from '@/presentation/hooks/useListings'

export function useMoreHomes(propertyId: string | undefined, limit = 4) {
  const listingsQuery = useAllListings()

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
