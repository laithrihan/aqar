import { describe, expect, it } from 'vitest'

import type { PropertySearchFilters } from '@/domain/home/PropertySearch'
import {
  filterRentListings,
  type RentListing,
} from '@/domain/rent/RentListing'

function listing(
  overrides: Partial<RentListing> & Pick<RentListing, 'id'>,
): RentListing {
  return {
    titleKey: 'rent.listing.title',
    locationKey: 'rent.listing.location',
    location: 'Riyadh',
    locationAr: 'الرياض',
    imageUrl: '/img.jpg',
    price: 5000,
    propertyType: 'apartment',
    rooms: 3,
    beds: 2,
    lat: 24.7,
    lng: 46.7,
    ...overrides,
  }
}

function filters(
  overrides: Partial<PropertySearchFilters> = {},
): PropertySearchFilters {
  return {
    mode: 'rent',
    location: '',
    propertyType: '',
    priceRange: '',
    rooms: '',
    beds: '',
    ...overrides,
  }
}

const sampleListings: RentListing[] = [
  listing({
    id: '1',
    location: 'Riyadh Al Olaya',
    locationAr: 'الرياض العليا',
    propertyType: 'apartment',
    price: 4000,
    rooms: 2,
    beds: 1,
  }),
  listing({
    id: '2',
    location: 'Jeddah Corniche',
    locationAr: 'جدة الكورنيش',
    propertyType: 'villa',
    price: 12000,
    rooms: 5,
    beds: 4,
  }),
  listing({
    id: '3',
    location: 'Riyadh Narjis',
    locationAr: 'الرياض النرجس',
    propertyType: 'apartment',
    price: 8000,
    rooms: 4,
    beds: 3,
  }),
]

describe('filterRentListings', () => {
  it('returns all listings when filters are null', () => {
    expect(filterRentListings(sampleListings, null)).toEqual(sampleListings)
  })

  it('returns all listings when filters are empty', () => {
    expect(filterRentListings(sampleListings, filters())).toEqual(
      sampleListings,
    )
  })

  it('filters by English location (case-insensitive substring)', () => {
    const result = filterRentListings(
      sampleListings,
      filters({ location: 'riyadh' }),
    )

    expect(result.map((item) => item.id)).toEqual(['1', '3'])
  })

  it('filters by Arabic location substring', () => {
    const result = filterRentListings(
      sampleListings,
      filters({ location: 'جدة' }),
    )

    expect(result.map((item) => item.id)).toEqual(['2'])
  })

  it('filters by property type', () => {
    const result = filterRentListings(
      sampleListings,
      filters({ propertyType: 'villa' }),
    )

    expect(result.map((item) => item.id)).toEqual(['2'])
  })

  it('filters by inclusive price range', () => {
    const result = filterRentListings(
      sampleListings,
      filters({ priceRange: '4000-8000' }),
    )

    expect(result.map((item) => item.id)).toEqual(['1', '3'])
  })

  it('filters by open-ended price range (min+)', () => {
    const result = filterRentListings(
      sampleListings,
      filters({ priceRange: '10000+' }),
    )

    expect(result.map((item) => item.id)).toEqual(['2'])
  })

  it('filters by exact room count', () => {
    const result = filterRentListings(
      sampleListings,
      filters({ rooms: '4' }),
    )

    expect(result.map((item) => item.id)).toEqual(['3'])
  })

  it('filters by 5+ room count', () => {
    const result = filterRentListings(
      sampleListings,
      filters({ rooms: '5+' }),
    )

    expect(result.map((item) => item.id)).toEqual(['2'])
  })

  it('filters by exact bed count', () => {
    const result = filterRentListings(sampleListings, filters({ beds: '1' }))

    expect(result.map((item) => item.id)).toEqual(['1'])
  })

  it('applies multiple filters together (AND)', () => {
    const result = filterRentListings(
      sampleListings,
      filters({
        location: 'Riyadh',
        propertyType: 'apartment',
        priceRange: '7000-9000',
        rooms: '4',
        beds: '3',
      }),
    )

    expect(result.map((item) => item.id)).toEqual(['3'])
  })

  it('returns an empty array when nothing matches', () => {
    const result = filterRentListings(
      sampleListings,
      filters({ propertyType: 'studio' }),
    )

    expect(result).toEqual([])
  })
})
