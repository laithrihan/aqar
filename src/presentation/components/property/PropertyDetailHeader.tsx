import { MdOutlineShare } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

import type { PropertyDetail } from '@/domain/property/PropertyDetail'
import { formatPrice } from '@/shared/lib/formatPrice'

type PropertyDetailHeaderProps = {
  property: PropertyDetail
}

/** Price row with owner label and share action. */
export function PropertyDetailHeader({ property }: PropertyDetailHeaderProps) {
  const { t, i18n } = useTranslation()

  async function handleShare() {
    const url = window.location.href
    const title = t(property.titleKey)

    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
    } catch {
      // User cancelled or share failed — fall through to clipboard.
    }

    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard may be unavailable; fail silently.
    }
  }

  return (
    <div className="property-detail-header">
      <div className="property-detail-header-price-group">
        <p className="property-detail-price">
          {formatPrice(property.price, i18n.language)}
        </p>
        <p className="property-detail-price-unit">{t('property.perMonth')}</p>
      </div>

      <div className="property-detail-header-divider" aria-hidden />

      <p className="property-detail-owner">
        {t('property.ownedBy', { name: property.ownerName })}
      </p>

      <button
        type="button"
        className="property-detail-share"
        onClick={() => void handleShare()}
      >
        <MdOutlineShare aria-hidden className="size-4" />
        {t('property.share')}
      </button>
    </div>
  )
}
