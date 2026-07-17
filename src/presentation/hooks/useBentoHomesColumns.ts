import { useQuery } from '@tanstack/react-query'

import { fetchBentoHomesColumns } from '@/infrastructure/home/bentoHomesRepository'

export const bentoHomesQueryKey = ['home', 'bento-homes'] as const

/** Loads bento column images for the explore-homes carousel. */
export function useBentoHomesColumns() {
  return useQuery({
    queryKey: bentoHomesQueryKey,
    queryFn: fetchBentoHomesColumns,
  })
}
