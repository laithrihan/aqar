import type { ComponentType } from 'react'
import {
  MdAir,
  MdBathtub,
  MdGarage,
  MdMeetingRoom,
  MdMapsHomeWork,
} from 'react-icons/md'
import { useTranslation } from 'react-i18next'

import type { PropertyDetail } from '@/domain/property/PropertyDetail'

type FeatureIcon = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>

type FeatureItem = {
  id: string
  label: string
  Icon: FeatureIcon
}

type PropertyFeaturesSectionProps = {
  property: PropertyDetail
}

export function PropertyFeaturesSection({ property }: PropertyFeaturesSectionProps) {
  const { t } = useTranslation()

  const parkingLabel =
    property.features.garageSpaces > 0
      ? t('property.features.garageSpaces', {
          count: property.features.garageSpaces,
        })
      : t('property.features.noParking')

  const items: FeatureItem[] = [
    {
      id: 'type',
      label: t(`property.features.types.${property.propertyType}`),
      Icon: MdMapsHomeWork,
    },
    {
      id: 'beds',
      label: t('property.features.bedrooms', { count: property.beds }),
      Icon: MdMeetingRoom,
    },
    {
      id: 'baths',
      label: t('property.features.bathrooms', { count: property.baths }),
      Icon: MdBathtub,
    },
    {
      id: 'heating',
      label: t(`property.features.heating.${property.features.heating}`),
      Icon: MdAir,
    },
    {
      id: 'parking',
      label: parkingLabel,
      Icon: MdGarage,
    },
  ]

  return (
    <section
      className="property-features"
      aria-labelledby="property-features-heading"
    >
      <h2 id="property-features-heading" className="property-features-title">
        {t('property.features.title')}
      </h2>

      <ul className="property-features-row" role="list">
        {items.map(({ id, label, Icon }) => (
          <li key={id} className="property-features-item">
            <span className="property-features-icon">
              <Icon aria-hidden />
            </span>
            <span className="property-features-label">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
