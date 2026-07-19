import { useTranslation } from 'react-i18next'

import type { ListingFeatureConfig } from '@/presentation/features/listings/listingFeature'
import { ListingFilterSearch } from '@/presentation/components/listings/ListingFilterSearch'
import { ListingsResultsSection } from '@/presentation/components/listings/ListingsResultsSection'

type ListingsPageProps = {
  config: ListingFeatureConfig
}

/**
 * Shared listings screen (header + filter + results). Both the rent and buy
 * pages render this with their own feature config.
 */
export function ListingsPage({ config }: ListingsPageProps) {
  const { t } = useTranslation()

  return (
    <div className="rent-page">
      <header className="rent-page-header">
        <h1 className="rent-page-title">{t(`${config.namespace}.title`)}</h1>
        <div className="rent-page-divider" aria-hidden />
      </header>

      <ListingFilterSearch config={config} />
      <ListingsResultsSection config={config} />
    </div>
  )
}
