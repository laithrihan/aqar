import type { Listing } from '@/domain/listing/Listing'
import type { PropertyDetail } from '@/domain/property/PropertyDetail'
import {
  mapListingRow,
  type ListingRow,
} from '@/infrastructure/listing/listingsApiRepository'
import { fetchMockJson } from '@/infrastructure/mock/mockFetch'

type ListingsResponse = {
  listings: ListingRow[]
}

async function loadListingRows(): Promise<ListingRow[]> {
  const data = await fetchMockJson<ListingsResponse>(
    'listings.json',
    'Failed to load listings',
  )
  return data.listings ?? []
}

/** Loads all published listings from local mock JSON. */
export async function fetchAllListings(): Promise<Listing[]> {
  const rows = await loadListingRows()
  return rows.map(mapListingRow)
}

/** Loads a single listing by id from local mock JSON. */
export async function fetchListingById(
  id: string,
): Promise<PropertyDetail | null> {
  const rows = await loadListingRows()
  const row = rows.find((item) => item.id === id)
  return row ? mapListingRow(row) : null
}
