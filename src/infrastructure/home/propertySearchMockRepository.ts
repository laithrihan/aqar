import type {
  LocationSuggestion,
  PropertySearchFilterOptions,
} from '@/domain/home/PropertySearch'
import { fetchMockJson } from '@/infrastructure/mock/mockFetch'

type LocationSuggestionsResponse = {
  locations: LocationSuggestion[]
}

/** Fetches property search filter options from local mock JSON. */
export async function fetchPropertySearchFilterOptions(): Promise<PropertySearchFilterOptions> {
  return fetchMockJson<PropertySearchFilterOptions>(
    'search-filters.json',
    'Failed to load search filter options',
  )
}

/** Fetches location typeahead suggestions from local mock JSON. */
export async function fetchLocationSuggestions(): Promise<LocationSuggestion[]> {
  const data = await fetchMockJson<LocationSuggestionsResponse>(
    'locations.json',
    'Failed to load location suggestions',
  )
  return data.locations ?? []
}
