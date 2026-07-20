import type { ListingPurpose } from '@/domain/listing/Listing'

export type OwnerProperty = {
  id: string
  ownerUserId: string
  purpose: ListingPurpose
  title: string
  titleAr: string
  location: string
  locationAr: string
  propertyType: string
  price: number
  rooms: number
  beds: number
  baths: number
  windows: number
  areaSqft: number | null
  lat: number
  lng: number
  imageUrl: string
  galleryUrls: string[]
  address: string
  addressAr: string
  ownerName: string
  ownerWhatsapp: string
  estimatedValue: number
  estimatedPaymentMonthly: number
  hasWifi: boolean
  hasHeater: boolean
  hasGarden: boolean
  heatingType: 'forced_air' | 'central' | 'none'
  garageSpaces: number
  tourVideoUrl: string
  updatedAt: string
}

export type UpsertOwnerPropertyInput = {
  purpose: ListingPurpose
  title: string
  titleAr: string
  location: string
  locationAr: string
  propertyType: string
  price: number
  rooms: number
  beds: number
  baths: number
  windows: number
  areaSqft: number | null
  lat: number
  lng: number
  imageUrl: string
  galleryUrls: string[]
  address: string
  addressAr: string
  ownerName: string
  ownerWhatsapp: string
  estimatedValue: number
  estimatedPaymentMonthly: number
  hasWifi: boolean
  hasHeater: boolean
  hasGarden: boolean
  heatingType: 'forced_air' | 'central' | 'none'
  garageSpaces: number
  tourVideoUrl: string
}

export type OwnerPropertyValidationResult = {
  valid: boolean
  errors: Partial<Record<keyof UpsertOwnerPropertyInput, string>>
}

function hasText(value: string): boolean {
  return value.trim().length > 0
}

/** Basic owner listing validation mirrored by backend later. */
export function validateOwnerPropertyInput(
  input: UpsertOwnerPropertyInput,
): OwnerPropertyValidationResult {
  const errors: OwnerPropertyValidationResult['errors'] = {}

  if (!hasText(input.title)) errors.title = 'owner.form.errors.titleRequired'
  if (!hasText(input.titleAr)) errors.titleAr = 'owner.form.errors.titleArRequired'
  if (!hasText(input.location)) {
    errors.location = 'owner.form.errors.locationRequired'
  }
  if (!hasText(input.locationAr)) {
    errors.locationAr = 'owner.form.errors.locationArRequired'
  }
  if (!hasText(input.propertyType)) {
    errors.propertyType = 'owner.form.errors.propertyTypeRequired'
  }
  if (input.price <= 0) errors.price = 'owner.form.errors.priceInvalid'
  if (input.rooms <= 0) errors.rooms = 'owner.form.errors.roomsInvalid'
  if (input.beds <= 0) errors.beds = 'owner.form.errors.bedsInvalid'
  if (input.baths <= 0) errors.baths = 'owner.form.errors.bathsInvalid'
  if (input.windows <= 0) errors.windows = 'owner.form.errors.windowsInvalid'
  if (input.areaSqft !== null && input.areaSqft <= 0) {
    errors.areaSqft = 'owner.form.errors.areaSqftInvalid'
  }
  if (!Number.isFinite(input.lat)) errors.lat = 'owner.form.errors.latInvalid'
  if (!Number.isFinite(input.lng)) errors.lng = 'owner.form.errors.lngInvalid'
  if (!hasText(input.imageUrl)) errors.imageUrl = 'owner.form.errors.imageUrlRequired'
  if (!hasText(input.address)) errors.address = 'owner.form.errors.addressRequired'
  if (!hasText(input.addressAr)) errors.addressAr = 'owner.form.errors.addressArRequired'
  if (!hasText(input.ownerName)) errors.ownerName = 'owner.form.errors.ownerNameRequired'
  if (!hasText(input.ownerWhatsapp)) {
    errors.ownerWhatsapp = 'owner.form.errors.ownerWhatsappRequired'
  }
  if (input.estimatedValue <= 0) {
    errors.estimatedValue = 'owner.form.errors.estimatedValueInvalid'
  }
  if (input.estimatedPaymentMonthly <= 0) {
    errors.estimatedPaymentMonthly = 'owner.form.errors.estimatedPaymentInvalid'
  }
  if (input.garageSpaces < 0) {
    errors.garageSpaces = 'owner.form.errors.garageSpacesInvalid'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

