import { useTranslation } from 'react-i18next'

import { PropertyHomeCard } from '@/presentation/components/property/PropertyHomeCard'
import { ListingCardsSkeleton } from '@/presentation/components/ui/ListingCardSkeleton'
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
        <>
          <span className="sr-only">{t('property.moreHomes.loading')}</span>
          <ListingCardsSkeleton
            count={4}
            gridClassName="property-more-homes-grid"
            cardClassName="property-home-card"
            bodyClassName="property-home-card-body"
            imageClassName="rounded-t-xl"
          />
        </>
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
