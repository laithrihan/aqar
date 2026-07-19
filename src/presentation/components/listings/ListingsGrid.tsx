import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { Listing } from '@/domain/listing/Listing'
import type { ListingFeatureConfig } from '@/presentation/features/listings/listingFeature'
import { ListingCard } from '@/presentation/components/listings/ListingCard'

type ListingsGridProps = {
  config: ListingFeatureConfig
  listings: Listing[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ListingsGrid({
  config,
  listings,
  selectedId,
  onSelect,
}: ListingsGridProps) {
  const { t } = useTranslation()
  const gridRef = useRef<HTMLDivElement>(null)

  // Scroll the selected card into view when selection comes from the map.
  useEffect(() => {
    if (!selectedId) return

    const frame = requestAnimationFrame(() => {
      const card = gridRef.current?.querySelector(
        `#${config.idPrefix}-listing-${CSS.escape(selectedId)}`,
      )
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })

    return () => cancelAnimationFrame(frame)
  }, [config.idPrefix, selectedId])

  if (listings.length === 0) {
    return (
      <div className="rent-listings-empty" role="status">
        <p>{t(`${config.namespace}.listings.empty`)}</p>
      </div>
    )
  }

  return (
    <div
      ref={gridRef}
      className="rent-listings-grid"
      role="list"
      aria-label={t(`${config.namespace}.listings.label`)}
    >
      {listings.map((listing) => (
        <div key={listing.id} role="listitem">
          <ListingCard
            config={config}
            listing={listing}
            selected={selectedId === listing.id}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  )
}
