import type {
  RentListing,
  RentListingsResponse,
} from '@/domain/rent/RentListing'

/**
 * Fetches rent listings from the temporary mock JSON.
 * Swap this for a real API endpoint later.
 */
export async function fetchRentListings(): Promise<RentListing[]> {
  const response = await fetch('/mock/rent-listings.json')

  if (!response.ok) {
    throw new Error('Failed to load rent listings')
  }

  const data = (await response.json()) as RentListingsResponse
  return data.listings
}
