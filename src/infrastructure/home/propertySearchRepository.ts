import type { PropertySearchFilterOptions } from '@/domain/home/PropertySearch'

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
