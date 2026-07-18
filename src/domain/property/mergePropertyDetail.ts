import type {
  PropertyDetail,
  PropertyDetailExtension,
} from '@/domain/property/PropertyDetail'
import type { RentListing } from '@/domain/rent/RentListing'

/** Merges a rent listing with its detail-only extension fields. */
export function mergePropertyDetail(
  listing: RentListing,
  extension: PropertyDetailExtension,
): PropertyDetail {
  const { id: _id, ...detailFields } = extension
  return { ...listing, ...detailFields }
}
