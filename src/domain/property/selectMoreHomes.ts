import type { Listing } from '@/domain/listing/Listing'

/** Picks recommendation cards, excluding the property currently being viewed. */
export function selectMoreHomes(
  listings: Listing[],
  excludePropertyId: string,
  limit = 4,
): Listing[] {
  return listings
    .filter((listing) => listing.id !== excludePropertyId)
    .slice(0, limit)
}
