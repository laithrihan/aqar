import type {
  LocationSuggestion,
  PropertySearchFilterOptions,
} from '@/domain/home/PropertySearch'
import { apiFetch } from '@/infrastructure/api/apiClient'

type LocationSuggestionsResponse = {
  locations: LocationSuggestion[]
}

/** Fetches property search filter options from the API. */
export async function fetchPropertySearchFilterOptions(): Promise<PropertySearchFilterOptions> {
  return apiFetch<PropertySearchFilterOptions>('/search/filters', {
    errorFallback: 'Failed to load search filter options',
  })
}

/** Fetches location typeahead suggestions from the API. */
export async function fetchLocationSuggestions(): Promise<LocationSuggestion[]> {
  const data = await apiFetch<LocationSuggestionsResponse>('/search/locations', {
    errorFallback: 'Failed to load location suggestions',
  })
  return data.locations ?? []
}
