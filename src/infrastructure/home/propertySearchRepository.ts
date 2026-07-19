import type {
  LocationSuggestion,
  PropertySearchFilterOptions,
} from '@/domain/home/PropertySearch'

/**
 * Fetches property search filter options from the temporary mock JSON.
 * Swap this for a real API endpoint later.
 */
export async function fetchPropertySearchFilterOptions(): Promise<PropertySearchFilterOptions> {
  const response = await fetch('/mock/property-search-filters.json')

  if (!response.ok) {
    throw new Error('Failed to load search filter options')
  }

  return (await response.json()) as PropertySearchFilterOptions
}

type LocationSuggestionsResponse = {
  locations: LocationSuggestion[]
}

/**
 * Fetches location typeahead suggestions from the temporary mock JSON.
 * Swap this for a real API endpoint later.
 */
export async function fetchLocationSuggestions(): Promise<LocationSuggestion[]> {
  const response = await fetch('/mock/location-suggestions.json')

  if (!response.ok) {
    throw new Error('Failed to load location suggestions')
  }

  const data = (await response.json()) as LocationSuggestionsResponse
  return data.locations
}
