import type {
  PropertySearchFilters,
  SearchFilterOption,
} from '@/domain/home/PropertySearch'

export type RentListing = {
  id: string
  titleKey: string
  locationKey: string
  location: string
  locationAr: string
  imageUrl: string
  price: number
  propertyType: string
  rooms: number
  beds: number
  lat: number
  lng: number
}

export type RentListingsResponse = {
  listings: RentListing[]
}

export type RentSortOption =
  | ''
  | 'price_asc'
  | 'price_desc'
  | 'rooms_desc'
  | 'rooms_asc'
  | 'beds_desc'
  | 'beds_asc'

export const RENT_SORT_OPTIONS: SearchFilterOption[] = [
  { value: 'price_asc', labelKey: 'rent.sort.priceAsc' },
  { value: 'price_desc', labelKey: 'rent.sort.priceDesc' },
  { value: 'rooms_desc', labelKey: 'rent.sort.roomsDesc' },
  { value: 'rooms_asc', labelKey: 'rent.sort.roomsAsc' },
  { value: 'beds_desc', labelKey: 'rent.sort.bedsDesc' },
  { value: 'beds_asc', labelKey: 'rent.sort.bedsAsc' },
]

function matchesPriceRange(price: number, priceRange: string): boolean {
  if (!priceRange) return true

  if (priceRange.endsWith('+')) {
    const min = Number(priceRange.slice(0, -1))
    return !Number.isNaN(min) && price >= min
  }

  const [minRaw, maxRaw] = priceRange.split('-')
  const min = Number(minRaw)
  const max = Number(maxRaw)

  if (Number.isNaN(min) || Number.isNaN(max)) return true
  return price >= min && price <= max
}

function matchesCount(value: number, filter: string): boolean {
  if (!filter) return true
  if (filter === '5+') return value >= 5
  const parsed = Number(filter)
  return !Number.isNaN(parsed) && value === parsed
}

export function filterRentListings(
  listings: RentListing[],
  filters: PropertySearchFilters | null,
): RentListing[] {
  if (!filters) return listings

  const locationQuery = filters.location.trim().toLowerCase()

  return listings.filter((listing) => {
    if (locationQuery) {
      const matchesEn = listing.location.toLowerCase().includes(locationQuery)
      const matchesAr = listing.locationAr.includes(filters.location.trim())
      if (!matchesEn && !matchesAr) return false
    }

    if (
      filters.propertyType &&
      listing.propertyType !== filters.propertyType
    ) {
      return false
    }

    if (
      filters.priceRange &&
      !matchesPriceRange(listing.price, filters.priceRange)
    ) {
      return false
    }

    if (!matchesCount(listing.rooms, filters.rooms)) return false
    if (!matchesCount(listing.beds, filters.beds)) return false

    return true
  })
}

export function sortRentListings(
  listings: RentListing[],
  sortBy: RentSortOption,
): RentListing[] {
  if (!sortBy) return listings

  const sorted = [...listings]

  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rooms_desc':
      return sorted.sort((a, b) => b.rooms - a.rooms || b.price - a.price)
    case 'rooms_asc':
      return sorted.sort((a, b) => a.rooms - b.rooms || a.price - b.price)
    case 'beds_desc':
      return sorted.sort((a, b) => b.beds - a.beds || b.price - a.price)
    case 'beds_asc':
      return sorted.sort((a, b) => a.beds - b.beds || a.price - b.price)
    default:
      return listings
  }
}
