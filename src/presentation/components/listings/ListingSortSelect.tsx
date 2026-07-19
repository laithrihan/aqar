import { useTranslation } from 'react-i18next'

import {
  buildListingSortOptions,
  type ListingSortOption,
} from '@/domain/listing/Listing'
import type { ListingFeatureConfig } from '@/presentation/features/listings/listingFeature'
import { SearchFilterSelect } from '@/presentation/components/home/SearchFilterSelect'

type ListingSortSelectProps = {
  config: ListingFeatureConfig
  value: ListingSortOption
  onChange: (value: ListingSortOption) => void
}

export function ListingSortSelect({
  config,
  value,
  onChange,
}: ListingSortSelectProps) {
  const { t } = useTranslation()

  return (
    <div className="rent-results-sort">
      <SearchFilterSelect
        id={`${config.idPrefix}-sort`}
        label={t(`${config.namespace}.sort.label`)}
        value={value}
        options={buildListingSortOptions(config.namespace)}
        placeholder={t(`${config.namespace}.sort.default`)}
        onChange={(nextValue) => onChange(nextValue as ListingSortOption)}
      />
    </div>
  )
}
