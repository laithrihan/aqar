import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { ExploreHomesSection } from '@/presentation/components/home/ExploreHomesSection'
import { HomeBootLoader } from '@/presentation/components/home/HomeBootLoader'
import { PanoramaCarousel } from '@/presentation/components/home/PanoramaCarousel'
import { PropertySearchFilter } from '@/presentation/components/home/PropertySearchFilter'
import { useCarouselSlides } from '@/presentation/hooks/useCarouselSlides'

/** Home page — hero panorama, search card, then explore-homes intro. */
export function HomePage() {
  const { t } = useTranslation()
  const { data: slides, isLoading, isError } = useCarouselSlides()

  return (
    <div className="home-page">
      <HomeBootLoader isBooting={isLoading} />

      <div className="home-hero">
        {isLoading && (
          <div className="panorama-carousel" aria-busy>
            <span className="sr-only">{t('home.carousel.loading')}</span>
            <Skeleton className="size-full rounded-none bg-primary/15" />
          </div>
        )}

        {isError && (
          <div
            className="panorama-carousel panorama-carousel--error"
            role="alert"
          >
            <p>{t('home.carousel.error')}</p>
          </div>
        )}

        {slides && slides.length > 0 && <PanoramaCarousel slides={slides} />}

        <div className="home-hero-search">
          <PropertySearchFilter />
        </div>
      </div>

      <ExploreHomesSection />
    </div>
  )
}
