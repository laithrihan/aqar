import type { RentListing } from '@/domain/rent/RentListing'

export type PropertyHeatingType = 'forcedAir' | 'central' | 'none'

/** Detail fields stored separately from the base rent listing. */
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
}

/** Full property detail = rent listing + detail extension. */
export type PropertyDetail = RentListing & Omit<PropertyDetailExtension, 'id'>

export type PropertyDetailsResponse = {
  listings: PropertyDetailExtension[]
}
