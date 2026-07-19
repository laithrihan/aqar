import type { LocationSuggestion } from '@/domain/home/PropertySearch'
import { includesIgnoreCase } from '@/shared/lib/includesIgnoreCase'
import { localizedText } from '@/shared/lib/localizedText'

const MAX_SUGGESTIONS = 8

export function getLocationSuggestionLabel(
  location: LocationSuggestion,
  language: string,
): string {
  return localizedText(language, location.label, location.labelAr)
}


export function resolveLocationInputDisplay(
  storedValue: string,
  locations: LocationSuggestion[],
  language: string,
): string {
  const match = locations.find((location) => location.value === storedValue)
  return match ? getLocationSuggestionLabel(match, language) : storedValue
}

export function filterLocationSuggestions(
  locations: LocationSuggestion[],
  query: string,
): LocationSuggestion[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  return locations
    .filter((location) => {
      return (
        includesIgnoreCase(location.label, trimmed) ||
        includesIgnoreCase(location.labelAr, trimmed) ||
        includesIgnoreCase(location.value, trimmed)
      )
    })
    .slice(0, MAX_SUGGESTIONS)
}
