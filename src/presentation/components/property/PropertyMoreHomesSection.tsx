import { useTranslation } from 'react-i18next'

import { PropertyHomeCard } from '@/presentation/components/property/PropertyHomeCard'
import { useMoreHomes } from '@/presentation/hooks/useMoreHomes'

type PropertyMoreHomesSectionProps = {
  propertyId: string
}

export function PropertyMoreHomesSection({
  propertyId,
}: PropertyMoreHomesSectionProps) {
  const { t } = useTranslation()
  const { data: homes = [], isPending, isError } = useMoreHomes(propertyId)

  return (
    <section
      className="property-more-homes"
      aria-labelledby="property-more-homes-heading"
    >
      <h2 id="property-more-homes-heading" className="property-more-homes-title">
        {t('property.moreHomes.title')}
      </h2>

      {isPending ? (
        <p className="property-more-homes-status">{t('property.moreHomes.loading')}</p>
      ) : null}

      {isError ? (
        <p className="property-more-homes-status">{t('property.moreHomes.error')}</p>
      ) : null}

      {!isPending && !isError && homes.length > 0 ? (
        <div className="property-more-homes-grid">
          {homes.map((listing) => (
            <PropertyHomeCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
