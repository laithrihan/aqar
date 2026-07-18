import { useTranslation } from 'react-i18next'

import type { PropertyDetail } from '@/domain/property/PropertyDetail'
import { formatPrice } from '@/shared/lib/formatPrice'

type PropertySummaryProps = {
  property: PropertyDetail
}

/** Compact facts, address, status, and estimate lines. */
export function PropertySummaryFacts({ property }: PropertySummaryProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const address = isArabic ? property.addressAr : property.address

  const areaLabel =
    property.areaSqft == null
      ? t('property.areaUnknown')
      : t('property.areaSqft', { count: property.areaSqft })

  const factsLine = [
    formatPrice(property.price, i18n.language),
    t('property.amenities.beds', { count: property.beds }),
    t('property.amenities.baths', { count: property.baths }),
    areaLabel,
  ].join(' · ')

  return (
    <div className="property-summary">
      <p className="property-summary-facts">{factsLine}</p>
      <p className="property-summary-address">{address}</p>
      <p className="property-summary-status">
        {t(`property.status.${property.status}`)}{' '}
        {t('property.zestimate', {
          value: formatPrice(property.estimatedValue, i18n.language),
        })}
      </p>
      <p className="property-summary-payment">
        {t('property.estPayment', {
          value: formatPrice(property.estimatedPaymentMonthly, i18n.language),
        })}
      </p>
      <button type="button" className="property-summary-cta">
        {t('property.getPreQualified')}
      </button>
    </div>
  )
}
