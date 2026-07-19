import type { SearchListingMode } from '@/domain/home/PropertySearch'
import type { ListingPurpose } from '@/domain/listing/Listing'

export type ListingFeatureConfig = {
  mode: SearchListingMode
  purpose: ListingPurpose
  namespace: string
  idPrefix: string
  priceUnitKey?: string
}

export const rentListingFeature: ListingFeatureConfig = {
  mode: 'rent',
  purpose: 'rent',
  namespace: 'rent',
  idPrefix: 'rent',
  priceUnitKey: 'rent.listings.perYear',
}

export const buyListingFeature: ListingFeatureConfig = {
  mode: 'sale',
  purpose: 'sale',
  namespace: 'buy',
  idPrefix: 'buy',
}
