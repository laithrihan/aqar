import { useQuery } from '@tanstack/react-query'

import type { PropertyDetail } from '@/domain/property/PropertyDetail'
import { mergePropertyDetail } from '@/domain/property/mergePropertyDetail'
import { fetchPropertyDetailExtension } from '@/infrastructure/property/propertyDetailRepository'
import { rentListingFeature } from '@/presentation/features/listings/listingFeature'
import { useListings } from '@/presentation/hooks/useListings'

export const propertyDetailQueryKey = (propertyId: string) =>
  ['property', 'detail', propertyId] as const

export function usePropertyDetail(propertyId: string | undefined) {
  const listingsQuery = useListings(rentListingFeature)

  const extensionQuery = useQuery({
    queryKey: propertyDetailQueryKey(propertyId ?? ''),
    queryFn: () => fetchPropertyDetailExtension(propertyId!),
    enabled: Boolean(propertyId),
  })

  const isPending = listingsQuery.isPending || extensionQuery.isPending
  const isError = listingsQuery.isError || extensionQuery.isError

  let data: PropertyDetail | null | undefined = undefined

  if (!isPending && !isError && propertyId) {
    const listing = listingsQuery.data?.find((item) => item.id === propertyId)
    const extension = extensionQuery.data

    data =
      listing && extension ? mergePropertyDetail(listing, extension) : null
  }

  return {
    data,
    isPending,
    isError,
  }
}
