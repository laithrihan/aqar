import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
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
  // Phone-only: the list overlays the map as a bottom drawer that can be
 const [drawerExpanded, setDrawerExpanded] = useState(false)
  const [dragOffset, setDragOffset] = useState<number | null>(null)

  const panelRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    startY: number
    peek: number
    base: number
    current: number
    moved: boolean
  } | null>(null)

  const PEEK_RATIO = 0.56
  const TAP_THRESHOLD = 5

  const onHandlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const panel = panelRef.current
    // Drag only applies to the phone drawer layout.
    if (!panel || window.innerWidth >= 768) return

    const peek = panel.offsetHeight * PEEK_RATIO
    const base = drawerExpanded ? 0 : peek
    dragRef.current = { startY: event.clientY, peek, base, current: base, moved: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onHandlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag) return

    const delta = event.clientY - drag.startY
    if (Math.abs(delta) > TAP_THRESHOLD) drag.moved = true

    const next = Math.min(Math.max(drag.base + delta, 0), drag.peek)
    drag.current = next
    setDragOffset(next)
  }

  const onHandlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag) return

    event.currentTarget.releasePointerCapture(event.pointerId)

    if (!drag.moved) {
      setDrawerExpanded((open) => !open)
    } else {
      // Snap to whichever state the drawer is closest to.
      setDrawerExpanded(drag.current < drag.peek / 2)
    }

    dragRef.current = null
    setDragOffset(null)
  }

  const filters = resolveFilters(config, appliedFilters, searchParams)
  const filtered = filterListings(listings, filters)
  const sorted = sortListings(filtered, sortBy)

  const activeSelectedId =
    selectedId && sorted.some((item) => item.id === selectedId)
      ? selectedId
      : null

  // Selecting from the map expands the drawer so the card is visible;
  // the grid then scrolls the focused card into view (see ListingsGrid).
  const handleMapSelect = (id: string) => {
    setSelectedId(id)
    setDrawerExpanded(true)
  }

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
                onSelect={handleMapSelect}
              />
            </APIProvider>
          ) : (
            <ListingsMapPlaceholder
              config={config}
              listings={sorted}
              selectedId={activeSelectedId}
              onSelect={handleMapSelect}
            />
          )}
        </div>

        <div
          ref={panelRef}
          className="rent-results-panel"
          data-expanded={drawerExpanded}
          style={
            dragOffset !== null
              ? { transform: `translateY(${dragOffset}px)`, transition: 'none' }
              : undefined
          }
        >
          <button
            type="button"
            className="rent-drawer-handle"
            aria-expanded={drawerExpanded}
            aria-label={t(`${config.namespace}.listings.view.label`)}
            onPointerDown={onHandlePointerDown}
            onPointerMove={onHandlePointerMove}
            onPointerUp={onHandlePointerUp}
            onPointerCancel={onHandlePointerUp}
          >
            <span className="rent-drawer-handle-bar" aria-hidden />
          </button>

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
