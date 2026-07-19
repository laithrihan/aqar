import { useState } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import type { PropertySearchFilters } from '@/domain/home/PropertySearch'
import {
  filterListings,
  sortListings,
  type ListingSortOption,
} from '@/domain/listing/Listing'
import type { ListingFeatureConfig } from '@/presentation/features/listings/listingFeature'
import { ListingsGrid } from '@/presentation/components/listings/ListingsGrid'
import { ListingCardsSkeleton } from '@/presentation/components/ui/ListingCardSkeleton'
import { ListingsMap } from '@/presentation/components/listings/ListingsMap'
import { ListingsMapPlaceholder } from '@/presentation/components/listings/ListingsMapPlaceholder'
import { ListingSortSelect } from '@/presentation/components/listings/ListingSortSelect'
import { useListings } from '@/presentation/hooks/useListings'
import { usePropertySearchStore } from '@/presentation/stores/propertySearchStore'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? ''

function resolveFilters(
  config: ListingFeatureConfig,
  applied: PropertySearchFilters | null,
  params: URLSearchParams,
): PropertySearchFilters | null {
  if (applied?.mode === config.mode) return applied

  const hasUrlFilters =
    params.has('location') ||
    params.has('propertyType') ||
    params.has('priceRange') ||
    params.has('rooms') ||
    params.has('beds')

  if (!hasUrlFilters && !applied) return null

  return {
    mode: config.mode,
    location: applied?.location ?? params.get('location') ?? '',
    propertyType: applied?.propertyType ?? params.get('propertyType') ?? '',
    priceRange: applied?.priceRange ?? params.get('priceRange') ?? '',
    rooms: applied?.rooms ?? params.get('rooms') ?? '',
    beds: applied?.beds ?? params.get('beds') ?? '',
  }
}

type ListingsResultsSectionProps = {
  config: ListingFeatureConfig
}

export function ListingsResultsSection({
  config,
}: ListingsResultsSectionProps) {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const appliedFilters = usePropertySearchStore((s) => s.appliedFilters)
  const { data: listings = [], isLoading, isError } = useListings(config)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<ListingSortOption>('')

  const filters = resolveFilters(config, appliedFilters, searchParams)
  const filtered = filterListings(listings, filters)
  const sorted = sortListings(filtered, sortBy)

  const activeSelectedId =
    selectedId && sorted.some((item) => item.id === selectedId)
      ? selectedId
      : null

  if (isError) {
    return (
      <div className="rent-results rent-results--status" role="alert">
        <p>{t(`${config.namespace}.listings.error`)}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <section
        className="rent-results"
        aria-busy
        aria-label={t(`${config.namespace}.resultsLabel`)}
      >
        <span className="sr-only">
          {t(`${config.namespace}.listings.loading`)}
        </span>
        <div className="rent-results-listings">
          <div className="rent-results-map">
            <Skeleton className="size-full min-h-[220px] rounded-[14px]" />
          </div>

          <div className="rent-results-panel">
            <div className="rent-results-toolbar">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>

            <div className="rent-listings-scroll">
              <ListingCardsSkeleton
                count={6}
                gridClassName="rent-listings-grid"
                cardClassName="rent-listing-card"
                bodyClassName="rent-listing-card-body"
                imageClassName="rounded-t-[12px]"
              />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="rent-results"
      aria-label={t(`${config.namespace}.resultsLabel`)}
    >
      <div className="rent-results-listings">
        <div className="rent-results-map">
          {GOOGLE_MAPS_API_KEY ? (
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <ListingsMap
                config={config}
                listings={sorted}
                selectedId={activeSelectedId}
                onSelect={setSelectedId}
              />
            </APIProvider>
          ) : (
            <ListingsMapPlaceholder
              config={config}
              listings={sorted}
              selectedId={activeSelectedId}
              onSelect={setSelectedId}
            />
          )}
        </div>

        <div className="rent-results-panel">
          <div className="rent-results-toolbar">
            <p className="rent-results-count">
              {t(`${config.namespace}.listings.count`, {
                count: sorted.length,
              })}
            </p>
            <ListingSortSelect
              config={config}
              value={sortBy}
              onChange={setSortBy}
            />
          </div>

          <div className="rent-listings-scroll">
            <ListingsGrid
              config={config}
              listings={sorted}
              selectedId={activeSelectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
