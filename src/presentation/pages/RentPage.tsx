import { useTranslation } from 'react-i18next'

import { RentFilterSearch } from '@/presentation/components/rent/RentFilterSearch'

export function RentPage() {
  const { t } = useTranslation()

  return (
    <div className="rent-page">
      <header className="rent-page-header">
        <h1 className="rent-page-title">{t('rent.title')}</h1>
        <div className="rent-page-divider" aria-hidden />
      </header>

      <RentFilterSearch />
    </div>
  )
}
