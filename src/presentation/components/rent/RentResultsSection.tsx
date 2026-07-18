import { useState } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import type { PropertySearchFilters } from '@/domain/home/PropertySearch'
import {
  filterRentListings,
  sortRentListings,
  type RentSortOption,
} from '@/domain/rent/RentListing'
import { RentListingsGrid } from '@/presentation/components/rent/RentListingsGrid'
import { ListingCardsSkeleton } from '@/presentation/components/ui/ListingCardSkeleton'
import { RentMap } from '@/presentation/components/rent/RentMap'
import { RentMapPlaceholder } from '@/presentation/components/rent/RentMapPlaceholder'
import { RentSortSelect } from '@/presentation/components/rent/RentSortSelect'
import { useRentListings } from '@/presentation/hooks/useRentListings'
import { usePropertySearchStore } from '@/presentation/stores/propertySearchStore'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? ''

function resolveFilters(
  applied: PropertySearchFilters | null,
  params: URLSearchParams,
): PropertySearchFilters | null {
  if (applied?.mode === 'rent') return applied

  const hasUrlFilters =
    params.has('location') ||
    params.has('propertyType') ||
    params.has('priceRange') ||
    params.has('rooms') ||
    params.has('beds')

  if (!hasUrlFilters && !applied) return null

  return {
    mode: 'rent',
    location: applied?.location ?? params.get('location') ?? '',
    propertyType: applied?.propertyType ?? params.get('propertyType') ?? '',
    priceRange: applied?.priceRange ?? params.get('priceRange') ?? '',
    rooms: applied?.rooms ?? params.get('rooms') ?? '',
    beds: applied?.beds ?? params.get('beds') ?? '',
  }
}

export function RentResultsSection() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const appliedFilters = usePropertySearchStore((s) => s.appliedFilters)
  const { data: listings = [], isLoading, isError } = useRentListings()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<RentSortOption>('')

  const filters = resolveFilters(appliedFilters, searchParams)
  const filtered = filterRentListings(listings, filters)
  const sorted = sortRentListings(filtered, sortBy)

  const activeSelectedId =
    selectedId && sorted.some((item) => item.id === selectedId)
      ? selectedId
      : null

  if (isError) {
    return (
      <div className="rent-results rent-results--status" role="alert">
        <p>{t('rent.listings.error')}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <section
        className="rent-results"
        aria-busy
        aria-label={t('rent.resultsLabel')}
      >
        <span className="sr-only">{t('rent.listings.loading')}</span>
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
    <section className="rent-results" aria-label={t('rent.resultsLabel')}>
      <div className="rent-results-listings">
        <div className="rent-results-map">
          {GOOGLE_MAPS_API_KEY ? (
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <RentMap
                listings={sorted}
                selectedId={activeSelectedId}
                onSelect={setSelectedId}
              />
            </APIProvider>
          ) : (
            <RentMapPlaceholder
              listings={sorted}
              selectedId={activeSelectedId}
              onSelect={setSelectedId}
            />
          )}
        </div>

        <div className="rent-results-panel">
          <div className="rent-results-toolbar">
            <p className="rent-results-count">
              {t('rent.listings.count', { count: sorted.length })}
            </p>
            <RentSortSelect value={sortBy} onChange={setSortBy} />
          </div>

          <div className="rent-listings-scroll">
            <RentListingsGrid
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
