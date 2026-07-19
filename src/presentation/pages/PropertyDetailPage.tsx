import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { PropertyAmenitiesGrid } from '@/presentation/components/property/PropertyAmenitiesGrid'
import { PropertyDetailHeader } from '@/presentation/components/property/PropertyDetailHeader'
import { PropertyFeaturesSection } from '@/presentation/components/property/PropertyFeaturesSection'
import { PropertyGallery } from '@/presentation/components/property/PropertyGallery'
import { PropertyMoreHomesSection } from '@/presentation/components/property/PropertyMoreHomesSection'
import { PropertyNearbySection } from '@/presentation/components/property/PropertyNearbySection'
import { PropertySellerActions } from '@/presentation/components/property/PropertySellerActions'
import { PropertySummaryFacts } from '@/presentation/components/property/PropertySummaryFacts'
import { PropertyTourSection } from '@/presentation/components/property/PropertyTourSection'
import { usePropertyDetail } from '@/presentation/hooks/usePropertyDetail'
import { localizedText } from '@/shared/lib/localizedText'

export function PropertyDetailPage() {
  const { propertyId } = useParams<{ propertyId: string }>()
  const { t, i18n } = useTranslation()
  const { data: property, isPending, isError } = usePropertyDetail(propertyId)

  if (isPending) {
    return (
      <div className="property-page property-page--status">
        <p>{t('property.loading')}</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="property-page property-page--status">
        <p>{t('property.error')}</p>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="property-page property-page--status">
        <p>{t('property.notFound')}</p>
      </div>
    )
  }

  return (
    <div className="property-page">
      <section
        className="property-hero"
        aria-label={localizedText(i18n.language, property.title, property.titleAr)}
      >
        <div className="property-hero-gallery">
          <PropertyGallery key={property.id} property={property} />
        </div>

        <div className="property-hero-info">
          <PropertyDetailHeader property={property} />
          <PropertySummaryFacts property={property} />
          <PropertyAmenitiesGrid property={property} />
          <PropertySellerActions property={property} />
        </div>
      </section>

      <PropertyFeaturesSection property={property} />
      <PropertyNearbySection property={property} />
      <PropertyTourSection property={property} />
      <PropertyMoreHomesSection propertyId={property.id} />
    </div>
  )
}
