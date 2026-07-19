import type {
  PropertySearchFilters,
  SearchFilterOption,
} from '@/domain/home/PropertySearch'
import { includesIgnoreCase } from '@/shared/lib/includesIgnoreCase'

/** Whether a listing is offered for rent or for sale. */
export type ListingPurpose = 'rent' | 'sale'

/**
 * Card-level shape of a listing.
 * Title/location text lives on the record (comes from the backend), not i18n.
 */
export type Listing = {
  id: string
  purpose: ListingPurpose
  title: string
  titleAr: string
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

export type ListingSortOption =
  | ''
  | 'price_asc'
  | 'price_desc'
  | 'rooms_desc'
  | 'rooms_asc'
  | 'beds_desc'
  | 'beds_asc'


export function buildListingSortOptions(
  namespace: string,
): SearchFilterOption[] {
  return [
    { value: 'price_asc', labelKey: `${namespace}.sort.priceAsc` },
    { value: 'price_desc', labelKey: `${namespace}.sort.priceDesc` },
    { value: 'rooms_desc', labelKey: `${namespace}.sort.roomsDesc` },
    { value: 'rooms_asc', labelKey: `${namespace}.sort.roomsAsc` },
    { value: 'beds_desc', labelKey: `${namespace}.sort.bedsDesc` },
    { value: 'beds_asc', labelKey: `${namespace}.sort.bedsAsc` },
  ]
}

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

/** Applies the property search filters to a set of listings. */
export function filterListings(
  listings: Listing[],
  filters: PropertySearchFilters | null,
): Listing[] {
  if (!filters) return listings

  const locationQuery = filters.location.trim()

  return listings.filter((listing) => {
    if (locationQuery) {
      const matchesEn = includesIgnoreCase(listing.location, locationQuery)
      const matchesAr = includesIgnoreCase(listing.locationAr, locationQuery)
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

/** Returns a sorted copy of the listings for the selected sort option. */
export function sortListings(
  listings: Listing[],
  sortBy: ListingSortOption,
): Listing[] {
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
