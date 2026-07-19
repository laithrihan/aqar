import { useEffect } from 'react'
import {
  AdvancedMarker,
  Map,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps'
import { useTranslation } from 'react-i18next'

import type { Listing } from '@/domain/listing/Listing'
import type { ListingFeatureConfig } from '@/presentation/features/listings/listingFeature'

/** Default center when no listings are visible (Damascus). */
const DAMASCUS_CENTER = { lat: 33.5138, lng: 36.2765 }

const MAP_ID =
  import.meta.env.VITE_GOOGLE_MAPS_MAP_ID?.trim() || 'DEMO_MAP_ID'

type ListingsMapProps = {
  config: ListingFeatureConfig
  listings: Listing[]
  selectedId: string | null
  onSelect: (id: string) => void
}

/** Fits the map camera to the current filtered markers. */
function MapBoundsController({ listings }: { listings: Listing[] }) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    if (listings.length === 0) {
      map.setCenter(DAMASCUS_CENTER)
      map.setZoom(11)
      return
    }

    if (listings.length === 1) {
      map.setCenter({ lat: listings[0].lat, lng: listings[0].lng })
      map.setZoom(14)
      return
    }

    const bounds = new google.maps.LatLngBounds()
    for (const listing of listings) {
      bounds.extend({ lat: listing.lat, lng: listing.lng })
    }
    map.fitBounds(bounds, 64)
  }, [map, listings])

  return null
}

/** Pans to the selected listing when selection changes from the list. */
function MapSelectionController({
  listings,
  selectedId,
}: {
  listings: Listing[]
  selectedId: string | null
}) {
  const map = useMap()

  useEffect(() => {
    if (!map || !selectedId) return
    const listing = listings.find((item) => item.id === selectedId)
    if (!listing) return
    map.panTo({ lat: listing.lat, lng: listing.lng })
  }, [map, listings, selectedId])

  return null
}

/**
 * Google Map with AdvancedMarkers for the currently filtered listings.
 */
export function ListingsMap({
  config,
  listings,
  selectedId,
  onSelect,
}: ListingsMapProps) {
  const { t } = useTranslation()

  return (
    <div
      className="rent-map"
      role="region"
      aria-label={t(`${config.namespace}.map.label`)}
    >
      <Map
        defaultCenter={DAMASCUS_CENTER}
        defaultZoom={11}
        mapId={MAP_ID}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="rent-map-canvas"
      >
        <MapBoundsController listings={listings} />
        <MapSelectionController listings={listings} selectedId={selectedId} />

        {listings.map((listing) => {
          const selected = selectedId === listing.id

          return (
            <AdvancedMarker
              key={listing.id}
              position={{ lat: listing.lat, lng: listing.lng }}
              title={t(listing.titleKey)}
              onClick={() => onSelect(listing.id)}
              zIndex={selected ? 10 : 1}
            >
              <Pin
                background={selected ? '#c45c26' : '#1a3a4a'}
                borderColor={selected ? '#8f3d12' : '#0f2430'}
                glyphColor="#ffffff"
                scale={selected ? 1.25 : 1}
              />
            </AdvancedMarker>
          )
        })}
      </Map>
    </div>
  )
}
