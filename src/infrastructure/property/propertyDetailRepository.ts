import type {
  PropertyDetail,
  PropertyDetailsResponse,
} from '@/domain/property/PropertyDetail'
import { fetchRentListings } from '@/infrastructure/rent/rentListingsRepository'

/**
 * Loads a property by merging the rent listing with detail-only mock fields.
 * Swap the detail fetch for a real API endpoint later.
 */
export async function fetchPropertyById(
  propertyId: string,
): Promise<PropertyDetail | null> {
  const [listings, detailResponse] = await Promise.all([
    fetchRentListings(),
    fetch('/mock/property-details.json'),
  ])

  if (!detailResponse.ok) {
    throw new Error('Failed to load property details')
  }

  const data = (await detailResponse.json()) as PropertyDetailsResponse
  const listing = listings.find((item) => item.id === propertyId)
  const extension = data.listings.find((item) => item.id === propertyId)

  if (!listing || !extension) return null

  const { id: _id, ...detailFields } = extension
  return { ...listing, ...detailFields }
}
