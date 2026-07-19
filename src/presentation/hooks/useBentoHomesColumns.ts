import { useQuery } from '@tanstack/react-query'

import { buildBentoColumnsFromListings } from '@/domain/home/buildBentoColumnsFromListings'
import { fetchAllListings } from '@/infrastructure/listing/listingsRepository'
import { listingsQueryKey } from '@/presentation/hooks/useListings'

/** Builds bento columns from the shared listings dataset. */
export function useBentoHomesColumns() {
  return useQuery({
    queryKey: listingsQueryKey,
    queryFn: fetchAllListings,
    select: buildBentoColumnsFromListings,
  })
}
