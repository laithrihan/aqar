import { useQuery } from '@tanstack/react-query'

import { fetchRentListings } from '@/infrastructure/rent/rentListingsRepository'

export const rentListingsQueryKey = ['rent', 'listings'] as const

export function useRentListings() {
  return useQuery({
    queryKey: rentListingsQueryKey,
    queryFn: fetchRentListings,
  })
}
