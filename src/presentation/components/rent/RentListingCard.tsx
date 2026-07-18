import { Link } from 'react-router-dom'
import { MdOutlineBed, MdOutlineMeetingRoom } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

import type { RentListing } from '@/domain/rent/RentListing'
import { ImageWithFallback } from '@/presentation/components/ui/ImageWithFallback'
import { cn } from '@/shared/lib/cn'
import { formatPrice } from '@/shared/lib/formatPrice'

type RentListingCardProps = {
  listing: RentListing
  selected: boolean
  onSelect: (id: string) => void
}


export function RentListingCard({
  listing,
  selected,
  onSelect,
}: RentListingCardProps) {
  const { t, i18n } = useTranslation()
  const title = t(listing.titleKey)
  const detailPath = `/homes/${listing.id}`

  return (
    <article
      id={`rent-listing-${listing.id}`}
      className={cn(
        'rent-listing-card',
        selected && 'rent-listing-card--selected',
      )}
      data-selected={selected || undefined}
    >
      <Link
        to={detailPath}
        className="rent-listing-card-media"
        onClick={() => onSelect(listing.id)}
        aria-label={title}
      >
        <ImageWithFallback
          src={listing.imageUrl}
          alt=""
          className="rent-listing-card-image"
          loading="lazy"
        />
      </Link>

      <div className="rent-listing-card-body">
        <Link
          to={detailPath}
          className="rent-listing-card-title"
          onClick={() => onSelect(listing.id)}
        >
          {title}
        </Link>

        <p className="rent-listing-card-location">{t(listing.locationKey)}</p>

        <p className="rent-listing-card-price">
          {formatPrice(listing.price, i18n.language)}
          <span className="rent-listing-card-price-unit">
            {t('rent.listings.perYear')}
          </span>
        </p>

        <div className="rent-listing-card-meta">
          <span className="rent-listing-card-meta-item">
            <MdOutlineMeetingRoom aria-hidden />
            {t('rent.listings.roomsCount', { count: listing.rooms })}
          </span>
          {listing.beds > 0 ? (
            <span className="rent-listing-card-meta-item">
              <MdOutlineBed aria-hidden />
              {t('rent.listings.bedsCount', { count: listing.beds })}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
