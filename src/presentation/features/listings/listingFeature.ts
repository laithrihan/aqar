import type { SearchListingMode } from '@/domain/home/PropertySearch'

export type ListingFeatureConfig = {
  mode: SearchListingMode
  namespace: string
  idPrefix: string
  queryKey: readonly unknown[]
  dataUrl: string
  priceUnitKey?: string
}

export const rentListingFeature: ListingFeatureConfig = {
  mode: 'rent',
  namespace: 'rent',
  idPrefix: 'rent',
  queryKey: ['rent', 'listings'],
  dataUrl: '/mock/rent-listings.json',
  priceUnitKey: 'rent.listings.perYear',
}

export const buyListingFeature: ListingFeatureConfig = {
  mode: 'sale',
  namespace: 'buy',
  idPrefix: 'buy',
  queryKey: ['buy', 'listings'],
  dataUrl: '/mock/buy-listings.json',
}
