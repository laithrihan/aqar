import { useQuery } from '@tanstack/react-query'

import { fetchPropertySearchFilterOptions } from '@/infrastructure/home/propertySearchRepository'

export const propertySearchFiltersQueryKey = [
  'home',
  'property-search-filters',
] as const

/** Loads dropdown options for the property search card. */
export function usePropertySearchFilterOptions() {
  return useQuery({
    queryKey: propertySearchFiltersQueryKey,
    queryFn: fetchPropertySearchFilterOptions,
  })
}
