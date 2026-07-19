import { useTranslation } from 'react-i18next'

import type { PropertyDetail } from '@/domain/property/PropertyDetail'
import { PropertyTourPlayer } from '@/presentation/components/property/PropertyTourPlayer'
import { localizedText } from '@/shared/lib/localizedText'

type PropertyTourSectionProps = {
  property: PropertyDetail
}

export function PropertyTourSection({ property }: PropertyTourSectionProps) {
  const { t, i18n } = useTranslation()
  const title = localizedText(i18n.language, property.title, property.titleAr)

  return (
    <section className="property-tour" aria-labelledby="property-tour-heading">
      <h2 id="property-tour-heading" className="property-tour-title">
        {t('property.tour.title')}
      </h2>

      <PropertyTourPlayer
        key={property.id}
        videoUrl={property.tourVideoUrl}
        posterUrl={property.imageUrl}
        title={title}
      />
    </section>
  )
}
