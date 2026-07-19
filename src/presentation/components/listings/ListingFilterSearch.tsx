import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaChevronDown } from 'react-icons/fa6'
import { HiOutlineSearch } from 'react-icons/hi'
import {
  MdOutlineAttachMoney,
  MdOutlineBed,
  MdOutlineHome,
  MdOutlineMeetingRoom,
  MdTune,
} from 'react-icons/md'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import type { PropertySearchFilters } from '@/domain/home/PropertySearch'
import type { ListingFeatureConfig } from '@/presentation/features/listings/listingFeature'
import { SearchFilterSelect } from '@/presentation/components/home/SearchFilterSelect'
import { usePropertySearchFilterOptions } from '@/presentation/hooks/usePropertySearchFilterOptions'
import { usePropertySearchStore } from '@/presentation/stores/propertySearchStore'
import { cn } from '@/shared/lib/cn'

function getDefaultValues(
  config: ListingFeatureConfig,
  applied: PropertySearchFilters | null,
  params: URLSearchParams,
): PropertySearchFilters {
  return {
    mode: config.mode,
    location: applied?.location ?? params.get('location') ?? '',
    propertyType: applied?.propertyType ?? params.get('propertyType') ?? '',
    priceRange: applied?.priceRange ?? params.get('priceRange') ?? '',
    rooms: applied?.rooms ?? params.get('rooms') ?? '',
    beds: applied?.beds ?? params.get('beds') ?? '',
  }
}

type ListingFilterSearchProps = {
  config: ListingFeatureConfig
}


export function ListingFilterSearch({ config }: ListingFilterSearchProps) {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: options } = usePropertySearchFilterOptions()
  const appliedFilters = usePropertySearchStore((s) => s.appliedFilters)
  const applyFilters = usePropertySearchStore((s) => s.applyFilters)

  const { register, handleSubmit, watch, setValue } =
    useForm<PropertySearchFilters>({
      defaultValues: getDefaultValues(config, appliedFilters, searchParams),
    })

  const propertyType = watch('propertyType')
  const priceRange = watch('priceRange')
  const rooms = watch('rooms')
  const beds = watch('beds')

  const activeCount = [propertyType, priceRange, rooms, beds].filter(
    Boolean,
  ).length

 const [filtersOpen, setFiltersOpen] = useState(activeCount > 0)

  const onSubmit = (values: PropertySearchFilters) => {
    const filters: PropertySearchFilters = {
      ...values,
      mode: config.mode,
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
      <label
        className="rent-filter-location"
        htmlFor={`${config.idPrefix}-location`}
      >
        <HiOutlineSearch className="rent-filter-location-icon" aria-hidden />
        <input
          id={`${config.idPrefix}-location`}
          type="search"
          placeholder={t('search.locationPlaceholder')}
          className="rent-filter-location-input"
          autoComplete="off"
          {...register('location')}
        />
      </label>

      {/* Mobile-only toggle that reveals the filter dropdowns */}
      <button
        type="button"
        className="rent-filter-toggle"
        aria-expanded={filtersOpen}
        aria-controls={`${config.idPrefix}-filter-selects`}
        onClick={() => setFiltersOpen((open) => !open)}
      >
        <span className="rent-filter-toggle-label">
          <MdTune aria-hidden />
          {t('search.filtersToggle')}
          {activeCount > 0 ? (
            <span className="rent-filter-toggle-badge">{activeCount}</span>
          ) : null}
        </span>
        <FaChevronDown
          className={cn(
            'rent-filter-toggle-chevron',
            filtersOpen && 'rent-filter-toggle-chevron--open',
          )}
          aria-hidden
        />
      </button>

      {/* Filter dropdowns */}
      <div
        id={`${config.idPrefix}-filter-selects`}
        className="rent-filter-selects"
        data-open={filtersOpen}
      >
        <SearchFilterSelect
          id={`${config.idPrefix}-property-type`}
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
          id={`${config.idPrefix}-price-range`}
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
          id={`${config.idPrefix}-rooms`}
          label={t('search.filters.rooms')}
          placeholder={t('search.filters.rooms')}
          icon={<MdOutlineMeetingRoom />}
          value={rooms}
          options={options?.rooms ?? []}
          onChange={(next) => setValue('rooms', next, { shouldDirty: true })}
        />
        <SearchFilterSelect
          id={`${config.idPrefix}-beds`}
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
