import { Link } from 'react-router-dom'
import { MdOutlineBed, MdOutlineMeetingRoom } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

import type { RentListing } from '@/domain/rent/RentListing'
import { ImageWithFallback } from '@/presentation/components/ui/ImageWithFallback'
import { formatPrice } from '@/shared/lib/formatPrice'

type PropertyHomeCardProps = {
  listing: RentListing
}

export function PropertyHomeCard({ listing }: PropertyHomeCardProps) {
  const { t, i18n } = useTranslation()
  const title = t(listing.titleKey)

  return (
    <article className="property-home-card">
      <Link to={`/homes/${listing.id}`} className="property-home-card-media">
        <ImageWithFallback
          src={listing.imageUrl}
          alt={title}
          className="property-home-card-image"
          loading="lazy"
        />
      </Link>

      <div className="property-home-card-body">
        <Link to={`/homes/${listing.id}`} className="property-home-card-title">
          {title}
        </Link>

        <p className="property-home-card-location">{t(listing.locationKey)}</p>

        <p className="property-home-card-price">
          {formatPrice(listing.price, i18n.language)}
          <span className="property-home-card-price-unit">
            {t('rent.listings.perYear')}
          </span>
        </p>

        <div className="property-home-card-meta">
          <span className="property-home-card-meta-item">
            <MdOutlineMeetingRoom aria-hidden />
            {t('rent.listings.roomsCount', { count: listing.rooms })}
          </span>
          {listing.beds > 0 ? (
            <span className="property-home-card-meta-item">
              <MdOutlineBed aria-hidden />
              {t('rent.listings.bedsCount', { count: listing.beds })}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
