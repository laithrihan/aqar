import { useTranslation } from 'react-i18next'
import { MdLocationOn } from 'react-icons/md'

import type { Listing } from '@/domain/listing/Listing'
import type { ListingFeatureConfig } from '@/presentation/features/listings/listingFeature'
import { cn } from '@/shared/lib/cn'

type ListingsMapPlaceholderProps = {
  config: ListingFeatureConfig
  listings: Listing[]
  selectedId: string | null
  onSelect: (id: string) => void
}

/**
 * Visual map stand-in used when Google Maps is unavailable (missing key / billing).
 * Pins are positioned from listing lat/lng so selection still syncs with the grid.
 */
export function ListingsMapPlaceholder({
  config,
  listings,
  selectedId,
  onSelect,
}: ListingsMapPlaceholderProps) {
  const { t } = useTranslation()
  const pins = positionPins(listings)

  return (
    <div
      className="rent-map-placeholder"
      role="region"
      aria-label={t(`${config.namespace}.map.label`)}
    >
      <div className="rent-map-placeholder-grid" aria-hidden />

      {pins.map((pin) => {
        const selected = selectedId === pin.id

        return (
          <button
            key={pin.id}
            type="button"
            className={cn(
              'rent-map-placeholder-pin',
              selected && 'rent-map-placeholder-pin--selected',
            )}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            aria-label={t(`${config.namespace}.listings.select`, {
              name: t(pin.titleKey),
            })}
            aria-pressed={selected}
            onClick={() => onSelect(pin.id)}
          >
            <MdLocationOn aria-hidden />
          </button>
        )
      })}

      <div className="rent-map-placeholder-message" role="status">
        <MdLocationOn className="rent-map-placeholder-icon" aria-hidden />
        <p>{t(`${config.namespace}.map.missingKey`)}</p>
      </div>
    </div>
  )
}

type PinPosition = Listing & { x: number; y: number }

/** Maps listing coordinates into padded percentage positions inside the placeholder. */
function positionPins(listings: Listing[]): PinPosition[] {
  if (listings.length === 0) return []

  const lats = listings.map((item) => item.lat)
  const lngs = listings.map((item) => item.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  const latSpan = Math.max(maxLat - minLat, 0.02)
  const lngSpan = Math.max(maxLng - minLng, 0.02)
  const pad = 12

  return listings.map((listing) => {
    const x = pad + ((listing.lng - minLng) / lngSpan) * (100 - pad * 2)
    const y = pad + ((maxLat - listing.lat) / latSpan) * (100 - pad * 2)

    return { ...listing, x, y }
  })
}
