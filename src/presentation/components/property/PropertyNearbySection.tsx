import type { ComponentType } from 'react'
import {
  MdLocalHospital,
  MdLocationOn,
  MdPark,
  MdRestaurant,
  MdSchool,
} from 'react-icons/md'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import type { NearbyPlaceCategory } from '@/domain/property/buildNearbyGoogleMapsUrl'
import { buildNearbyGoogleMapsUrl } from '@/domain/property/buildNearbyGoogleMapsUrl'
import type { PropertyDetail } from '@/domain/property/PropertyDetail'
import { ImageWithFallback } from '@/presentation/components/ui/ImageWithFallback'

const NEARBY_MAP_IMAGE = '/images/nearby-map.png'

type NearbyIcon = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>

const NEARBY_PLACES = [
  {
    id: 'location',
    titleKey: 'property.nearby.location',
    Icon: MdLocationOn,
  },
  {
    id: 'hospitals',
    titleKey: 'property.nearby.hospitals',
    Icon: MdLocalHospital,
  },
  {
    id: 'restaurants',
    titleKey: 'property.nearby.restaurants',
    Icon: MdRestaurant,
  },
  {
    id: 'parks',
    titleKey: 'property.nearby.parks',
    Icon: MdPark,
  },
  {
    id: 'schools',
    titleKey: 'property.nearby.schools',
    Icon: MdSchool,
  },
] as const satisfies ReadonlyArray<{
  id: NearbyPlaceCategory
  titleKey: string
  Icon: NearbyIcon
}>

type NearbyPlace = (typeof NEARBY_PLACES)[number]

type PropertyNearbyCardProps = {
  place: NearbyPlace
  lat: number
  lng: number
}

function PropertyNearbyCard({ place, lat, lng }: PropertyNearbyCardProps) {
  const { t } = useTranslation()
  const title = t(place.titleKey)
  const { Icon } = place
  const mapsUrl = buildNearbyGoogleMapsUrl(place.id, { lat, lng })

  return (
    <Card className="property-nearby-card group overflow-hidden p-0">
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="property-nearby-card-link"
        aria-label={t('property.nearby.openMap', { place: title })}
      >
        <div className="property-nearby-card-media">
          <ImageWithFallback
            src={NEARBY_MAP_IMAGE}
            alt=""
            className="property-nearby-card-image"
            loading="lazy"
          />
          <div className="property-nearby-card-overlay" aria-hidden>
            <span className="property-nearby-card-icon">
              <Icon />
            </span>
          </div>
        </div>

        <CardContent className="property-nearby-card-body">
          <CardTitle className="property-nearby-card-title">{title}</CardTitle>
        </CardContent>
      </a>
    </Card>
  )
}

/** Location section — each card opens Google Maps for that place type. */
export function PropertyNearbySection({
  property,
}: {
  property: PropertyDetail
}) {
  const { t } = useTranslation()

  return (
    <section className="property-nearby" aria-labelledby="property-nearby-heading">
      <header className="property-nearby-header">
        <h2 id="property-nearby-heading" className="property-nearby-title">
          {t('property.nearby.title')}
        </h2>
      </header>

      <div className="property-nearby-row">
        {NEARBY_PLACES.map((place) => (
          <PropertyNearbyCard
            key={place.id}
            place={place}
            lat={property.lat}
            lng={property.lng}
          />
        ))}
      </div>
    </section>
  )
}
