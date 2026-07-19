import type {
  PropertyDetail,
  PropertyDetailExtension,
} from '@/domain/property/PropertyDetail'
import type { Listing } from '@/domain/listing/Listing'

/** Merges a listing with its detail-only extension fields. */
export function mergePropertyDetail(
  listing: Listing,
  extension: PropertyDetailExtension,
): PropertyDetail {
  const { id: _id, ...detailFields } = extension
  return { ...listing, ...detailFields }
}
