import type { Listing } from '@/domain/listing/Listing'

export type PropertyHeatingType = 'forcedAir' | 'central' | 'none'

export type PropertyAmenities = {
  wifi: boolean
  heater: boolean
  garden: boolean
}

export type PropertyFeatures = {
  heating: PropertyHeatingType
  garageSpaces: number
}

/**
 * Full property detail — a listing plus its detail-only fields.
 * Both the base listing and the detail fields come from a single backend record.
 */
export type PropertyDetail = Listing & {
  galleryUrls: string[]
  baths: number
  windows: number
  areaSqft: number | null
  address: string
  addressAr: string
  ownerName: string
  ownerWhatsapp: string
  estimatedValue: number
  estimatedPaymentMonthly: number
  amenities: PropertyAmenities
  features: PropertyFeatures
  tourVideoUrl: string
}
