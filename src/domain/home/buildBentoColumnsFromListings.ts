import type { BentoColumn, BentoImage } from '@/domain/home/BentoHomes'
import type { RentListing } from '@/domain/rent/RentListing'

const BENTO_PROPERTY_TYPES = new Set(['villa', 'house', 'apartment'])

function toBentoImage(listing: RentListing, suffix: string): BentoImage {
  return {
    id: `${listing.id}-${suffix}`,
    propertyId: listing.id,
    imageUrl: listing.imageUrl,
    titleKey: listing.titleKey,
  }
}

export function buildBentoColumnsFromListings(
  listings: RentListing[],
): BentoColumn[] {
  const homes = listings.filter((listing) =>
    BENTO_PROPERTY_TYPES.has(listing.propertyType),
  )

  const columns: BentoColumn[] = []
  let index = 0
  let columnIndex = 0

  while (index < homes.length) {
    const useStack = columnIndex % 2 === 0 && index + 1 < homes.length

    if (useStack) {
      columns.push({
        id: `col-${columnIndex + 1}`,
        layout: 'stack',
        images: [
          toBentoImage(homes[index], 'a'),
          toBentoImage(homes[index + 1], 'b'),
        ],
      })
      index += 2
    } else {
      columns.push({
        id: `col-${columnIndex + 1}`,
        layout: 'tall',
        images: [toBentoImage(homes[index], 'a')],
      })
      index += 1
    }

    columnIndex += 1
  }

  return columns
}
