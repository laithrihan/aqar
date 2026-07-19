import { useForm } from "react-hook-form";
import {HiOutlineLockClosed, HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type {
  PropertySearchFilters,
  SearchListingMode,
} from '@/domain/home/PropertySearch'
import { SearchFilterSelect } from '@/presentation/components/home/SearchFilterSelect'
import { usePropertySearchFilterOptions } from '@/presentation/hooks/usePropertySearchFilterOptions'
import { usePropertySearchStore } from '@/presentation/stores/propertySearchStore'
import { cn } from '@/shared/lib/cn'

const LISTING_MODES: SearchListingMode[] = ["sale", "rent", "invest"];

const DISABLED_MODES: ReadonlySet<SearchListingMode> = new Set(["invest"]);

const DEFAULT_VALUES: PropertySearchFilters = {
  mode: 'sale',
  location: '',
  propertyType: '',
  priceRange: '',
  rooms: '',
  beds: '',
}

/**
 * Home property search / filter card (Figma homepage search panel).
 * Form state is managed with React Hook Form; submitted filters sync to Zustand.
 */
export function PropertySearchFilter() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: options } = usePropertySearchFilterOptions()
  const applyFilters = usePropertySearchStore((s) => s.applyFilters)

  const { register, handleSubmit, watch, setValue } =
    useForm<PropertySearchFilters>({
      defaultValues: DEFAULT_VALUES,
    })

  const mode = watch('mode')
  const propertyType = watch('propertyType')
  const priceRange = watch('priceRange')
  const rooms = watch('rooms')
  const beds = watch('beds')

  const onSubmit = (values: PropertySearchFilters) => {
    const filters: PropertySearchFilters = {
      ...values,
      location: values.location.trim(),
    }

    applyFilters(filters)

    const params = new URLSearchParams()
    if (filters.location) params.set('location', filters.location)
    if (filters.propertyType) params.set('propertyType', filters.propertyType)
    if (filters.priceRange) params.set('priceRange', filters.priceRange)
    if (filters.rooms) params.set('rooms', filters.rooms)
    if (filters.beds) params.set('beds', filters.beds)

    const path = filters.mode === 'rent' ? '/rent' : '/buy'
    const query = params.toString()
    void navigate(query ? `${path}?${query}` : path)
  }

  return (
    <form className="property-search" onSubmit={handleSubmit(onSubmit)}>
      {/* Listing mode tabs */}
      <div
        className="property-search-tabs"
        role="tablist"
        aria-label={t("search.modesLabel")}
      >
        {/* Hidden field so `mode` is part of the RHF form values */}
        <input type="hidden" {...register("mode")} />

        {LISTING_MODES.map((listingMode) => {
          const isDisabled = DISABLED_MODES.has(listingMode);

          return (
            <button
              key={listingMode}
              type="button"
              role="tab"
              aria-selected={mode === listingMode}
              aria-disabled={isDisabled}
              disabled={isDisabled}
              title={
                isDisabled
                  ? t(`search.modes.${listingMode}Locked`)
                  : undefined
              }
              className={cn(
                "property-search-tab",
                mode === listingMode && "property-search-tab--active",
                isDisabled && "property-search-tab--locked",
              )}
              onClick={() => {
                if (isDisabled) return;
                setValue("mode", listingMode, { shouldDirty: true });
              }}
            >
              <span className="property-search-tab-label">
                {t(`search.modes.${listingMode}`)}
              </span>

              {/* Lock overlay — invest is coming soon */}
              {isDisabled ? (
                <span className="property-search-tab-lock" aria-hidden>
                  <HiOutlineLockClosed className="property-search-tab-lock-icon" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Location search */}
      <label className="property-search-location" htmlFor="property-location">
        <HiOutlineSearch
          className="property-search-location-icon"
          aria-hidden
        />
        <input
          id="property-location"
          type="search"
          placeholder={t('search.locationPlaceholder')}
          className="property-search-location-input"
          autoComplete="off"
          {...register('location')}
        />
      </label>

      {/* Filter dropdowns */}
      <div className="property-search-filters">
        <SearchFilterSelect
          id="property-type"
          label={t('search.filters.propertyType')}
          placeholder={t('search.filters.propertyType')}
          value={propertyType}
          options={options?.propertyTypes ?? []}
          onChange={(next) =>
            setValue('propertyType', next, { shouldDirty: true })
          }
        />
        <SearchFilterSelect
          id="price-range"
          label={t('search.filters.priceRange')}
          placeholder={t('search.filters.priceRange')}
          value={priceRange}
          options={options?.priceRanges ?? []}
          onChange={(next) =>
            setValue('priceRange', next, { shouldDirty: true })
          }
        />
        <SearchFilterSelect
          id="rooms"
          label={t('search.filters.rooms')}
          placeholder={t('search.filters.rooms')}
          value={rooms}
          options={options?.rooms ?? []}
          onChange={(next) => setValue('rooms', next, { shouldDirty: true })}
        />
        <SearchFilterSelect
          id="beds"
          label={t('search.filters.beds')}
          placeholder={t('search.filters.beds')}
          value={beds}
          options={options?.beds ?? []}
          onChange={(next) => setValue('beds', next, { shouldDirty: true })}
        />
      </div>

      <button type="submit" className="property-search-submit">
        {t('search.results')}
      </button>
    </form>
  )
}
