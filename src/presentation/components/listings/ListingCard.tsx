import { Link } from 'react-router-dom'
import { MdOutlineBed, MdOutlineMeetingRoom } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

import type { Listing } from '@/domain/listing/Listing'
import type { ListingFeatureConfig } from '@/presentation/features/listings/listingFeature'
import { SaveListingButton } from '@/presentation/components/saved/SaveListingButton'
import { ImageWithFallback } from '@/presentation/components/ui/ImageWithFallback'
import { cn } from '@/shared/lib/cn'
import { formatPrice } from '@/shared/lib/formatPrice'
import { localizedText } from '@/shared/lib/localizedText'

type ListingCardProps = {
  config: ListingFeatureConfig
  listing: Listing
  selected: boolean
  onSelect: (id: string) => void
}

export function ListingCard({
  config,
  listing,
  selected,
  onSelect,
}: ListingCardProps) {
  const { t, i18n } = useTranslation()
  const title = localizedText(i18n.language, listing.title, listing.titleAr)
  const location = localizedText(
    i18n.language,
    listing.location,
    listing.locationAr,
  )
  const detailPath = `/homes/${listing.id}`

  return (
    <article
      id={`${config.idPrefix}-listing-${listing.id}`}
      className={cn(
        'rent-listing-card',
        selected && 'rent-listing-card--selected',
      )}
      data-selected={selected || undefined}
    >
      <div className="rent-listing-card-media-wrap">
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
        <SaveListingButton listingId={listing.id} variant="overlay" />
      </div>

      <div className="rent-listing-card-body">
        <Link
          to={detailPath}
          className="rent-listing-card-title"
          onClick={() => onSelect(listing.id)}
        >
          {title}
        </Link>

        <p className="rent-listing-card-location">{location}</p>

        <p className="rent-listing-card-price">
          {formatPrice(listing.price, i18n.language)}
          {config.priceUnitKey ? (
            <span className="rent-listing-card-price-unit">
              {t(config.priceUnitKey)}
            </span>
          ) : null}
        </p>

        <div className="rent-listing-card-meta">
          {listing.rooms > 0 ? (
            <span className="rent-listing-card-meta-item">
              <MdOutlineMeetingRoom aria-hidden />
              {t(`${config.namespace}.listings.roomsCount`, {
                count: listing.rooms,
              })}
            </span>
          ) : null}
          {listing.beds > 0 ? (
            <span className="rent-listing-card-meta-item">
              <MdOutlineBed aria-hidden />
              {t(`${config.namespace}.listings.bedsCount`, {
                count: listing.beds,
              })}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
