import { useTranslation } from 'react-i18next'

import {
  RENT_SORT_OPTIONS,
  type RentSortOption,
} from '@/domain/rent/RentListing'
import { SearchFilterSelect } from '@/presentation/components/home/SearchFilterSelect'

type RentSortSelectProps = {
  value: RentSortOption
  onChange: (value: RentSortOption) => void
}

export function RentSortSelect({ value, onChange }: RentSortSelectProps) {
  const { t } = useTranslation()

  return (
    <div className="rent-results-sort">
      <SearchFilterSelect
        id="rent-sort"
        label={t('rent.sort.label')}
        value={value}
        options={RENT_SORT_OPTIONS}
        placeholder={t('rent.sort.default')}
        onChange={(nextValue) => onChange(nextValue as RentSortOption)}
      />
    </div>
  )
}
