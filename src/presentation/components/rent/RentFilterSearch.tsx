import { useForm } from 'react-hook-form'
import { HiOutlineSearch } from 'react-icons/hi'
import {
  MdOutlineAttachMoney,
  MdOutlineBed,
  MdOutlineHome,
  MdOutlineMeetingRoom,
} from 'react-icons/md'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import type { PropertySearchFilters } from '@/domain/home/PropertySearch'
import { SearchFilterSelect } from '@/presentation/components/home/SearchFilterSelect'
import { usePropertySearchFilterOptions } from '@/presentation/hooks/usePropertySearchFilterOptions'
import { usePropertySearchStore } from '@/presentation/stores/propertySearchStore'

function getDefaultValues(
  applied: PropertySearchFilters | null,
  params: URLSearchParams,
): PropertySearchFilters {
  return {
    mode: 'rent',
    location: applied?.location ?? params.get('location') ?? '',
    propertyType: applied?.propertyType ?? params.get('propertyType') ?? '',
    priceRange: applied?.priceRange ?? params.get('priceRange') ?? '',
    rooms: applied?.rooms ?? params.get('rooms') ?? '',
    beds: applied?.beds ?? params.get('beds') ?? '',
  }
}

/**
 * Rent page filter bar — location search, type/price/rooms/beds selects, Search.
 */
export function RentFilterSearch() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: options } = usePropertySearchFilterOptions()
  const appliedFilters = usePropertySearchStore((s) => s.appliedFilters)
  const applyFilters = usePropertySearchStore((s) => s.applyFilters)

  const { register, handleSubmit, watch, setValue } =
    useForm<PropertySearchFilters>({
      defaultValues: getDefaultValues(appliedFilters, searchParams),
    })

  const propertyType = watch('propertyType')
  const priceRange = watch('priceRange')
  const rooms = watch('rooms')
  const beds = watch('beds')

  const onSubmit = (values: PropertySearchFilters) => {
    const filters: PropertySearchFilters = {
      ...values,
      mode: 'rent',
      location: values.location.trim(),
    }

    applyFilters(filters)

    const params = new URLSearchParams()
    if (filters.location) params.set('location', filters.location)
    if (filters.propertyType) params.set('propertyType', filters.propertyType)
    if (filters.priceRange) params.set('priceRange', filters.priceRange)
    if (filters.rooms) params.set('rooms', filters.rooms)
    if (filters.beds) params.set('beds', filters.beds)

    setSearchParams(params, { replace: true })
  }

  return (
    <form className="rent-filter" onSubmit={handleSubmit(onSubmit)}>
      {/* Location search */}
      <label className="rent-filter-location" htmlFor="rent-location">
        <HiOutlineSearch className="rent-filter-location-icon" aria-hidden />
        <input
          id="rent-location"
          type="search"
          placeholder={t('search.locationPlaceholder')}
          className="rent-filter-location-input"
          autoComplete="off"
          {...register('location')}
        />
      </label>

      {/* Filter dropdowns */}
      <div className="rent-filter-selects">
        <SearchFilterSelect
          id="rent-property-type"
          label={t('search.filters.propertyType')}
          placeholder={t('search.filters.propertyType')}
          icon={<MdOutlineHome />}
          value={propertyType}
          options={options?.propertyTypes ?? []}
          onChange={(next) =>
            setValue('propertyType', next, { shouldDirty: true })
          }
        />
        <SearchFilterSelect
          id="rent-price-range"
          label={t('search.filters.priceRange')}
          placeholder={t('search.filters.priceRange')}
          icon={<MdOutlineAttachMoney />}
          value={priceRange}
          options={options?.priceRanges ?? []}
          onChange={(next) =>
            setValue('priceRange', next, { shouldDirty: true })
          }
        />
        <SearchFilterSelect
          id="rent-rooms"
          label={t('search.filters.rooms')}
          placeholder={t('search.filters.rooms')}
          icon={<MdOutlineMeetingRoom />}
          value={rooms}
          options={options?.rooms ?? []}
          onChange={(next) => setValue('rooms', next, { shouldDirty: true })}
        />
        <SearchFilterSelect
          id="rent-beds"
          label={t('search.filters.beds')}
          placeholder={t('search.filters.beds')}
          icon={<MdOutlineBed />}
          value={beds}
          options={options?.beds ?? []}
          onChange={(next) => setValue('beds', next, { shouldDirty: true })}
        />
      </div>

      <button type="submit" className="rent-filter-submit">
        {t('search.submit')}
      </button>
    </form>
  )
}
