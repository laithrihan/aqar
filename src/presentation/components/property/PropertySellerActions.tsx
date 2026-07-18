import { useId, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { MdOutlinePersonOutline } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

import type { PropertyDetail } from '@/domain/property/PropertyDetail'
import { buildWhatsappUrl } from '@/shared/lib/whatsapp'

type PropertySellerActionsProps = {
  property: PropertyDetail
}

/** Seller details disclosure and WhatsApp contact actions. */
export function PropertySellerActions({ property }: PropertySellerActionsProps) {
  const { t } = useTranslation()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const detailsId = useId()
  const whatsappHref = buildWhatsappUrl(property.ownerWhatsapp)

  return (
    <div className="property-seller">
      <div className="property-seller-actions">
        <button
          type="button"
          className="property-seller-btn property-seller-btn--details"
          aria-expanded={detailsOpen}
          aria-controls={detailsId}
          onClick={() => setDetailsOpen((open) => !open)}
        >
          <MdOutlinePersonOutline aria-hidden className="size-5" />
          {t('property.sellerDetails')}
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="property-seller-btn property-seller-btn--whatsapp"
        >
          <FaWhatsapp aria-hidden className="size-5" />
          {t('property.sellerWhatsapp')}
        </a>
      </div>

      {detailsOpen ? (
        <div
          id={detailsId}
          className="property-seller-details"
          role="region"
          aria-label={t('property.sellerDetails')}
        >
          <p className="property-seller-details-name">{property.ownerName}</p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="property-seller-details-phone"
            dir="ltr"
          >
            +{property.ownerWhatsapp}
          </a>
        </div>
      ) : null}
    </div>
  )
}
