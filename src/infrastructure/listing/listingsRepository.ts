import type { Listing, ListingPurpose } from '@/domain/listing/Listing'
import type {
  PropertyDetail,
  PropertyHeatingType,
} from '@/domain/property/PropertyDetail'
import { apiFetch } from '@/infrastructure/api/apiClient'

/**
 * Raw listing row as returned by the Laravel API.
 * Columns are snake_case to mirror the `listings` table.
 */
type ListingRow = {
  id: string
  purpose: ListingPurpose
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
  heating_type: string
  garage_spaces: number
  tour_video_url: string | null
}

type ListingsResponse = {
  listings: ListingRow[]
}

const HEATING_MAP: Record<string, PropertyHeatingType> = {
  forced_air: 'forcedAir',
  central: 'central',
  none: 'none',
}

function mapListingRow(row: ListingRow): PropertyDetail {
  return {
    id: row.id,
    purpose: row.purpose,
    title: row.title,
    titleAr: row.title_ar,
    location: row.location,
    locationAr: row.location_ar,
    imageUrl: row.image_url,
    price: row.price,
    propertyType: row.property_type,
    rooms: row.rooms,
    beds: row.beds,
    lat: row.lat,
    lng: row.lng,
    galleryUrls: row.gallery_urls ?? [],
    baths: row.baths,
    windows: row.windows,
    areaSqft: row.area_sqft,
    address: row.address,
    addressAr: row.address_ar,
    ownerName: row.owner_name,
    ownerWhatsapp: row.owner_whatsapp,
    estimatedValue: row.estimated_value,
    estimatedPaymentMonthly: row.estimated_payment_monthly,
    amenities: {
      wifi: row.has_wifi,
      heater: row.has_heater,
      garden: row.has_garden,
    },
    features: {
      heating: HEATING_MAP[row.heating_type] ?? 'none',
      garageSpaces: row.garage_spaces,
    },
    tourVideoUrl: row.tour_video_url ?? '',
  }
}

/** Loads all published listings (card-level / detail shape). */
export async function fetchAllListings(): Promise<Listing[]> {
  const data = await apiFetch<ListingsResponse>('/listings', {
    errorFallback: 'Failed to load listings',
  })
  return (data.listings ?? []).map(mapListingRow)
}

/** Loads a single published listing by id, or null when not found. */
export async function fetchListingById(
  id: string,
): Promise<PropertyDetail | null> {
  try {
    const row = await apiFetch<ListingRow>(`/listings/${encodeURIComponent(id)}`, {
      errorFallback: 'Failed to load listing',
    })
    return mapListingRow(row)
  } catch {
    return null
  }
}
