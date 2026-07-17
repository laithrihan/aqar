import { useTranslation } from 'react-i18next'

import { PanoramaCarousel } from '@/presentation/components/home/PanoramaCarousel'
import { PropertySearchFilter } from '@/presentation/components/home/PropertySearchFilter'
import { useCarouselSlides } from '@/presentation/hooks/useCarouselSlides'

/** Home page — hero panorama + overlapping property search card. */
export function HomePage() {
  const { t } = useTranslation()
  const { data: slides, isLoading, isError } = useCarouselSlides()

  return (
    <div className="home-page">
      <div className="home-hero">
        {isLoading && (
          <div className="panorama-carousel panorama-carousel--skeleton" aria-busy>
            <span className="sr-only">{t('home.carousel.loading')}</span>
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
    </div>
  )
}
