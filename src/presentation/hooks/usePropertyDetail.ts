import { useQuery } from '@tanstack/react-query'

import { fetchPropertyById } from '@/infrastructure/property/propertyDetailRepository'

export const propertyDetailQueryKey = (propertyId: string) =>
  ['property', 'detail', propertyId] as const

export function usePropertyDetail(propertyId: string | undefined) {
  return useQuery({
    queryKey: propertyDetailQueryKey(propertyId ?? ''),
    queryFn: () => fetchPropertyById(propertyId!),
    enabled: Boolean(propertyId),
  })
}
