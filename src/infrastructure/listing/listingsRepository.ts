import type { Listing, ListingPurpose } from '@/domain/listing/Listing'
import type {
  PropertyDetail,
  PropertyHeatingType,
} from '@/domain/property/PropertyDetail'

/** Temporary mock endpoint. Swap for the real API URL later. */
const LISTINGS_URL = '/mock/listings.json'

/**
 * Raw listing row as returned by the mock (and, later, the backend API).
 * Columns are snake_case to mirror the Laravel `listings` table / seed.
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
  tour_video_url: string
}

type ListingsResponse = {
  listings: ListingRow[]
}

/** Maps the DB enum value to the app heating type. */
const HEATING_MAP: Record<string, PropertyHeatingType> = {
  forced_air: 'forcedAir',
  central: 'central',
  none: 'none',
}

/** Maps a snake_case backend row into the camelCase domain property detail. */
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
    galleryUrls: row.gallery_urls,
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
    tourVideoUrl: row.tour_video_url,
  }
}

/** Loads and maps every listing row from the data source. */
async function loadListings(): Promise<PropertyDetail[]> {
  const response = await fetch(LISTINGS_URL)

  if (!response.ok) {
    throw new Error('Failed to load listings')
  }

  const data = (await response.json()) as ListingsResponse
  return data.listings.map(mapListingRow)
}

/** Loads all listings (card-level shape). */
export async function fetchAllListings(): Promise<Listing[]> {
  return loadListings()
}

/** Loads a single full property detail by id, or null when not found. */
export async function fetchListingById(
  id: string,
): Promise<PropertyDetail | null> {
  const listings = await loadListings()
  return listings.find((listing) => listing.id === id) ?? null
}
