/** Nearby place categories shown on the property detail map cards. */
export type NearbyPlaceCategory =
  | 'location'
  | 'hospitals'
  | 'restaurants'
  | 'parks'
  | 'schools'

type Coordinates = {
  lat: number
  lng: number
}

/** Google Maps search keywords (English for reliable place-type results). */
const NEARBY_MAP_QUERY: Record<
  Exclude<NearbyPlaceCategory, 'location'>,
  string
> = {
  hospitals: 'hospitals',
  restaurants: 'restaurants',
  parks: 'parks',
  schools: 'schools',
}

/**
 * Builds a Google Maps URL centered on the property.
 * Location opens the pin; other categories search that place type nearby.
 */
export function buildNearbyGoogleMapsUrl(
  category: NearbyPlaceCategory,
  { lat, lng }: Coordinates,
): string {
  if (category === 'location') {
    return `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`
  }

  const query = encodeURIComponent(NEARBY_MAP_QUERY[category])
  return `https://www.google.com/maps/search/${query}/@${lat},${lng},15z`
}
