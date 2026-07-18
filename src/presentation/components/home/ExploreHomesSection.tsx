import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { BentoHomesCarousel } from '@/presentation/components/home/BentoHomesCarousel'
import { useBentoHomesColumns } from '@/presentation/hooks/useBentoHomesColumns'

/**
 * Home “Explore homes” section — intro copy + infinite bento image carousel.
 */
export function ExploreHomesSection() {
  const { t } = useTranslation()
  const { data: columns, isLoading, isError } = useBentoHomesColumns()

  return (
    <section className="explore-homes" aria-labelledby="explore-homes-heading">
      <div className="explore-homes-intro">
        <h2 id="explore-homes-heading" className="explore-homes-title">
          {t('home.explore.title')}
        </h2>

        <div className="explore-homes-divider" aria-hidden />

        <p className="explore-homes-description">{t('home.explore.description')}</p>
      </div>

      {isLoading && (
        <div className="bento-homes-carousel" aria-busy>
          <span className="sr-only">{t('home.explore.bento.loading')}</span>
          <Skeleton className="mx-4 h-[320px] w-auto rounded-[12px] sm:mx-6 sm:h-[420px]" />
        </div>
      )}

      {isError && (
        <p className="bento-homes-carousel-error" role="alert">
          {t('home.explore.bento.error')}
        </p>
      )}

      {columns && columns.length > 0 && <BentoHomesCarousel columns={columns} />}
    </section>
  )
}
