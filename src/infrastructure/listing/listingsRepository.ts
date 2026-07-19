import type { Listing, ListingsResponse } from '@/domain/listing/Listing'

/**
 * Fetches listings from a temporary mock JSON file.
 * Swap the URL for a real API endpoint later.
 */
export async function fetchListings(dataUrl: string): Promise<Listing[]> {
  const response = await fetch(dataUrl)

  if (!response.ok) {
    throw new Error(`Failed to load listings from ${dataUrl}`)
  }

  const data = (await response.json()) as ListingsResponse
  return data.listings
}
