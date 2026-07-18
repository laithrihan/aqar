import { useQuery } from '@tanstack/react-query'

import { buildBentoColumnsFromListings } from '@/domain/home/buildBentoColumnsFromListings'
import { fetchRentListings } from '@/infrastructure/rent/rentListingsRepository'
import { rentListingsQueryKey } from '@/presentation/hooks/useRentListings'

/** Loads bento columns from the same rent listings used across the app. */
export function useBentoHomesColumns() {
  return useQuery({
    queryKey: rentListingsQueryKey,
    queryFn: fetchRentListings,
    select: buildBentoColumnsFromListings,
  })
}
