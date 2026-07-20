import type {
  OwnerProperty,
  UpsertOwnerPropertyInput,
} from '@/domain/owner/OwnerProperty'

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
  tour_video_url: string
  updated_at: string
}

type OwnerPropertiesResponse = {
  properties: OwnerPropertyRow[]
}

const OWNER_PROPERTIES_URL = '/mock/owner-properties.json'
const OWNER_PROPERTIES_KEY = 'aqar-owner-properties'

let seedRows: OwnerPropertyRow[] | null = null
let overlayRows: OwnerPropertyRow[] | null = null
let loadPromise: Promise<void> | null = null

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

function toRow(
  ownerUserId: string,
  id: string,
  input: UpsertOwnerPropertyInput,
): OwnerPropertyRow {
  return {
    id,
    owner_user_id: ownerUserId,
    purpose: input.purpose,
    title: input.title.trim(),
    title_ar: input.titleAr.trim(),
    location: input.location.trim(),
    location_ar: input.locationAr.trim(),
    property_type: input.propertyType.trim(),
    price: input.price,
    rooms: input.rooms,
    beds: input.beds,
    baths: input.baths,
    windows: input.windows,
    area_sqft: input.areaSqft,
    lat: input.lat,
    lng: input.lng,
    image_url: input.imageUrl.trim(),
    gallery_urls: input.galleryUrls,
    address: input.address.trim(),
    address_ar: input.addressAr.trim(),
    owner_name: input.ownerName.trim(),
    owner_whatsapp: input.ownerWhatsapp.trim(),
    estimated_value: input.estimatedValue,
    estimated_payment_monthly: input.estimatedPaymentMonthly,
    has_wifi: input.hasWifi,
    has_heater: input.hasHeater,
    has_garden: input.hasGarden,
    heating_type: input.heatingType,
    garage_spaces: input.garageSpaces,
    tour_video_url: input.tourVideoUrl.trim(),
    updated_at: new Date().toISOString(),
  }
}

function readOverlayRows(): OwnerPropertyRow[] {
  try {
    const raw = localStorage.getItem(OWNER_PROPERTIES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as OwnerPropertyRow[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeOverlayRows(rows: OwnerPropertyRow[]): void {
  localStorage.setItem(OWNER_PROPERTIES_KEY, JSON.stringify(rows))
}

function buildMergedRows(): OwnerPropertyRow[] {
  const byId = new Map<string, OwnerPropertyRow>()

  for (const row of seedRows ?? []) {
    byId.set(row.id, row)
  }
  for (const row of overlayRows ?? []) {
    byId.set(row.id, row)
  }

  return Array.from(byId.values())
}

async function ensureLoaded(): Promise<void> {
  if (seedRows && overlayRows) return
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    const response = await fetch(OWNER_PROPERTIES_URL)
    if (!response.ok) {
      throw new Error('owner.errors.loadFailed')
    }
    const payload = (await response.json()) as OwnerPropertiesResponse
    seedRows = Array.isArray(payload.properties) ? payload.properties : []
    overlayRows = readOverlayRows()
  })()

  try {
    await loadPromise
  } finally {
    loadPromise = null
  }
}

function randomId(): string {
  return `owner-${Math.random().toString(36).slice(2, 10)}`
}

export async function fetchOwnerProperties(
  ownerUserId: string,
): Promise<OwnerProperty[]> {
  await ensureLoaded()
  return buildMergedRows()
    .filter((row) => row.owner_user_id === ownerUserId)
    .map(mapRow)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}

export async function createOwnerProperty(
  ownerUserId: string,
  input: UpsertOwnerPropertyInput,
): Promise<OwnerProperty[]> {
  await ensureLoaded()
  const next = [...(overlayRows ?? [])]
  next.push(toRow(ownerUserId, randomId(), input))
  overlayRows = next
  writeOverlayRows(next)
  return fetchOwnerProperties(ownerUserId)
}

export async function updateOwnerProperty(
  ownerUserId: string,
  propertyId: string,
  input: UpsertOwnerPropertyInput,
): Promise<OwnerProperty[]> {
  await ensureLoaded()
  const current = buildMergedRows().find((row) => row.id === propertyId)
  if (!current || current.owner_user_id !== ownerUserId) {
    throw new Error('owner.errors.notFound')
  }

  const rest = (overlayRows ?? []).filter((row) => row.id !== propertyId)
  overlayRows = [...rest, toRow(ownerUserId, propertyId, input)]
  writeOverlayRows(overlayRows)

  return fetchOwnerProperties(ownerUserId)
}

export async function deleteOwnerProperty(
  ownerUserId: string,
  propertyId: string,
): Promise<OwnerProperty[]> {
  await ensureLoaded()
  const snapshot = buildMergedRows().find((row) => row.id === propertyId)
  if (!snapshot || snapshot.owner_user_id !== ownerUserId) {
    throw new Error('owner.errors.notFound')
  }

  // Mark deletion in overlay by writing all visible rows except this one.
  const visibleWithoutDeleted = buildMergedRows().filter((row) => row.id !== propertyId)
  overlayRows = visibleWithoutDeleted
  writeOverlayRows(visibleWithoutDeleted)

  return fetchOwnerProperties(ownerUserId)
}

