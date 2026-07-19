import { useQuery } from '@tanstack/react-query'

import { fetchLocationSuggestions } from '@/infrastructure/home/propertySearchRepository'

export const locationSuggestionsQueryKey = [
  'home',
  'location-suggestions',
] as const

export function useLocationSuggestions() {
  return useQuery({
    queryKey: locationSuggestionsQueryKey,
    queryFn: fetchLocationSuggestions,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
