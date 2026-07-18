import type { RentListing } from '@/domain/rent/RentListing'

/** Picks recommendation cards, excluding the property currently being viewed. */
export function selectMoreHomes(
  listings: RentListing[],
  excludePropertyId: string,
  limit = 4,
): RentListing[] {
  return listings
    .filter((listing) => listing.id !== excludePropertyId)
    .slice(0, limit)
}
