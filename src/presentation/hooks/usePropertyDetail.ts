import { useQuery } from '@tanstack/react-query'

import { fetchListingById } from '@/infrastructure/listing/listingsRepository'

export const propertyDetailQueryKey = (propertyId: string) =>
  ['listing', propertyId] as const

export function usePropertyDetail(propertyId: string | undefined) {
  const query = useQuery({
    queryKey: propertyDetailQueryKey(propertyId ?? ''),
    queryFn: () => fetchListingById(propertyId!),
    enabled: Boolean(propertyId),
  })

  return {
    data: query.data,
    isPending: query.isPending,
    isError: query.isError,
  }
}
