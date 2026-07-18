import type { ReactNode } from 'react'
import {
  MdOutlineBathtub,
  MdOutlineBed,
  MdOutlineGrass,
  MdOutlineWindow,
  MdWifi,
  MdWhatshot,
} from 'react-icons/md'
import { useTranslation } from 'react-i18next'

import type { PropertyDetail } from '@/domain/property/PropertyDetail'
import { cn } from '@/shared/lib/cn'

type PropertyAmenitiesGridProps = {
  property: PropertyDetail
}

type AmenityItem = {
  id: string
  label: string
  icon: ReactNode
  active: boolean
}

export function PropertyAmenitiesGrid({ property }: PropertyAmenitiesGridProps) {
  const { t } = useTranslation()

  const items: AmenityItem[] = [
    {
      id: 'baths',
      label: t('property.amenities.baths', { count: property.baths }),
      icon: <MdOutlineBathtub aria-hidden />,
      active: true,
    },
    {
      id: 'windows',
      label: t('property.amenities.windows', { count: property.windows }),
      icon: <MdOutlineWindow aria-hidden />,
      active: true,
    },
    {
      id: 'beds',
      label: t('property.amenities.beds', { count: property.beds }),
      icon: <MdOutlineBed aria-hidden />,
      active: true,
    },
    {
      id: 'wifi',
      label: t('property.amenities.wifi'),
      icon: <MdWifi aria-hidden />,
      active: property.amenities.wifi,
    },
    {
      id: 'heater',
      label: t('property.amenities.heater'),
      icon: <MdWhatshot aria-hidden />,
      active: property.amenities.heater,
    },
    {
      id: 'garden',
      label: t('property.amenities.garden'),
      icon: <MdOutlineGrass aria-hidden />,
      active: property.amenities.garden,
    },
  ]

  return (
    <ul className="property-amenities" role="list">
      {items.map((item) => (
        <li
          key={item.id}
          className={cn(
            'property-amenity',
            !item.active && 'property-amenity--inactive',
          )}
        >
          <span className="property-amenity-icon">{item.icon}</span>
          <span className="property-amenity-label">{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
