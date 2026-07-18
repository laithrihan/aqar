import type {
  PropertyDetailExtension,
  PropertyDetailsResponse,
} from '@/domain/property/PropertyDetail'

/**
 * Loads detail-only mock fields for a single property.
 * Swap the fetch for a real API endpoint later.
 */
export async function fetchPropertyDetailExtension(
  propertyId: string,
): Promise<PropertyDetailExtension | null> {
  const response = await fetch('/mock/property-details.json')

  if (!response.ok) {
    throw new Error('Failed to load property details')
  }

  const data = (await response.json()) as PropertyDetailsResponse
  return data.listings.find((item) => item.id === propertyId) ?? null
}
