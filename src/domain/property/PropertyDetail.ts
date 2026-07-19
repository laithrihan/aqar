import type { Listing } from '@/domain/listing/Listing'

export type PropertyHeatingType = 'forcedAir' | 'central' | 'none'

/** Detail fields stored separately from the base listing. */
export type PropertyDetailExtension = {
  id: string
  galleryUrls: string[]
  baths: number
  windows: number
  areaSqft: number | null
  address: string
  addressAr: string
  ownerName: string
  ownerWhatsapp: string
  status: 'rent' | 'sale'
  estimatedValue: number
  estimatedPaymentMonthly: number
  amenities: {
    wifi: boolean
    heater: boolean
    garden: boolean
  }
  features: {
    heating: PropertyHeatingType
    garageSpaces: number
  }
  tourVideoUrl: string
}

export type PropertyDetail = Listing & Omit<PropertyDetailExtension, 'id'>

export type PropertyDetailsResponse = {
  listings: PropertyDetailExtension[]
}
