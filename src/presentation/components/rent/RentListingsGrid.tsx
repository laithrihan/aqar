import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { RentListing } from '@/domain/rent/RentListing'
import { RentListingCard } from '@/presentation/components/rent/RentListingCard'

type RentListingsGridProps = {
  listings: RentListing[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function RentListingsGrid({
  listings,
  selectedId,
  onSelect,
}: RentListingsGridProps) {
  const { t } = useTranslation()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selectedId || !gridRef.current) return
    const card = gridRef.current.querySelector(
      `#rent-listing-${CSS.escape(selectedId)}`,
    )
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedId])

  if (listings.length === 0) {
    return (
      <div className="rent-listings-empty" role="status">
        <p>{t('rent.listings.empty')}</p>
      </div>
    )
  }

  return (
    <div
      ref={gridRef}
      className="rent-listings-grid"
      role="list"
      aria-label={t('rent.listings.label')}
    >
      {listings.map((listing) => (
        <div key={listing.id} role="listitem">
          <RentListingCard
            listing={listing}
            selected={selectedId === listing.id}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  )
}
