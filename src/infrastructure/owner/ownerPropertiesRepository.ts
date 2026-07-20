import type {
  OwnerProperty,
  UpsertOwnerPropertyInput,
} from '@/domain/owner/OwnerProperty'
import { apiFetch } from '@/infrastructure/api/apiClient'

type OwnerPropertyRow = {
  id: string
  owner_user_id: string
  purpose: 'rent' | 'sale'
  title: string
  title_ar: string
  location: string
  location_ar: string
  property_type: string
  price: number
  rooms: number
  beds: number
  baths: number
  windows: number
  area_sqft: number | null
  lat: number
  lng: number
  image_url: string
  gallery_urls: string[]
  address: string
  address_ar: string
  owner_name: string
  owner_whatsapp: string
  estimated_value: number
  estimated_payment_monthly: number
  has_wifi: boolean
  has_heater: boolean
  has_garden: boolean
  heating_type: 'forced_air' | 'central' | 'none'
  garage_spaces: number
  tour_video_url: string | null
  updated_at: string
}

type OwnerPropertiesResponse = {
  properties: OwnerPropertyRow[]
}

function mapRow(row: OwnerPropertyRow): OwnerProperty {
  return {
    id: row.id,
    ownerUserId: row.owner_user_id,
    purpose: row.purpose,
    title: row.title,
    titleAr: row.title_ar,
    location: row.location,
    locationAr: row.location_ar,
    propertyType: row.property_type,
    price: row.price,
    rooms: row.rooms,
    beds: row.beds,
    baths: row.baths ?? 1,
    windows: row.windows ?? 1,
    areaSqft: row.area_sqft ?? null,
    lat: row.lat ?? 33.5138,
    lng: row.lng ?? 36.2765,
    imageUrl: row.image_url ?? '',
    galleryUrls: row.gallery_urls ?? [],
    address: row.address ?? row.location,
    addressAr: row.address_ar ?? row.location_ar,
    ownerName: row.owner_name ?? '',
    ownerWhatsapp: row.owner_whatsapp ?? '',
    estimatedValue: row.estimated_value ?? row.price,
    estimatedPaymentMonthly: row.estimated_payment_monthly ?? 0,
    hasWifi: row.has_wifi ?? false,
    hasHeater: row.has_heater ?? false,
    hasGarden: row.has_garden ?? false,
    heatingType: row.heating_type ?? 'none',
    garageSpaces: row.garage_spaces ?? 0,
    tourVideoUrl: row.tour_video_url ?? '',
    updatedAt: row.updated_at,
  }
}

function toApiBody(input: UpsertOwnerPropertyInput) {
  return {
    purpose: input.purpose,
    title: input.title.trim(),
    titleAr: input.titleAr.trim(),
    location: input.location.trim(),
    locationAr: input.locationAr.trim(),
    propertyType: input.propertyType.trim(),
    price: input.price,
    rooms: input.rooms,
    beds: input.beds,
    baths: input.baths,
    windows: input.windows,
    areaSqft: input.areaSqft,
    lat: input.lat,
    lng: input.lng,
    imageUrl: input.imageUrl.trim(),
    galleryUrls: input.galleryUrls,
    address: input.address.trim(),
    addressAr: input.addressAr.trim(),
    ownerName: input.ownerName.trim(),
    ownerWhatsapp: input.ownerWhatsapp.trim(),
    estimatedValue: input.estimatedValue,
    estimatedPaymentMonthly: input.estimatedPaymentMonthly,
    hasWifi: input.hasWifi,
    hasHeater: input.hasHeater,
    hasGarden: input.hasGarden,
    heatingType: input.heatingType,
    garageSpaces: input.garageSpaces,
    tourVideoUrl: input.tourVideoUrl.trim(),
  }
}

function mapProperties(data: OwnerPropertiesResponse): OwnerProperty[] {
  return (data.properties ?? []).map(mapRow)
}

/** Loads properties owned by the authenticated owner account. */
export async function fetchOwnerProperties(
  _ownerUserId?: string,
): Promise<OwnerProperty[]> {
  const data = await apiFetch<OwnerPropertiesResponse>('/owner/properties', {
    auth: true,
    errorFallback: 'owner.errors.loadFailed',
  })
  return mapProperties(data)
}

export async function createOwnerProperty(
  _ownerUserId: string,
  input: UpsertOwnerPropertyInput,
): Promise<OwnerProperty[]> {
  const data = await apiFetch<OwnerPropertiesResponse>('/owner/properties', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(toApiBody(input)),
    errorFallback: 'owner.errors.loadFailed',
  })
  return mapProperties(data)
}

export async function updateOwnerProperty(
  _ownerUserId: string,
  propertyId: string,
  input: UpsertOwnerPropertyInput,
): Promise<OwnerProperty[]> {
  try {
    const data = await apiFetch<OwnerPropertiesResponse>(
      `/owner/properties/${encodeURIComponent(propertyId)}`,
      {
        method: 'PUT',
        auth: true,
        body: JSON.stringify(toApiBody(input)),
        errorFallback: 'owner.errors.notFound',
      },
    )
    return mapProperties(data)
  } catch (error) {
    if (error instanceof Error && error.message === 'owner.errors.notFound') {
      throw error
    }
    throw new Error('owner.errors.loadFailed')
  }
}

export async function deleteOwnerProperty(
  _ownerUserId: string,
  propertyId: string,
): Promise<OwnerProperty[]> {
  try {
    const data = await apiFetch<OwnerPropertiesResponse>(
      `/owner/properties/${encodeURIComponent(propertyId)}`,
      {
        method: 'DELETE',
        auth: true,
        errorFallback: 'owner.errors.notFound',
      },
    )
    return mapProperties(data)
  } catch (error) {
    if (error instanceof Error && error.message === 'owner.errors.notFound') {
      throw error
    }
    throw new Error('owner.errors.loadFailed')
  }
}
