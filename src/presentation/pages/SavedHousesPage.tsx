import { useTranslation } from 'react-i18next'

import { SavedHousesTable } from '@/presentation/components/saved/SavedHousesTable'

export function SavedHousesPage() {
  const { t } = useTranslation()

  return (
    <div className="saved-houses-page">
      <header className="saved-houses-header">
        <h1 className="saved-houses-title">{t('saved.title')}</h1>
        <div className="saved-houses-divider" aria-hidden />
        <p className="saved-houses-subtitle">{t('saved.subtitle')}</p>
      </header>

      <SavedHousesTable />
    </div>
  )
}
