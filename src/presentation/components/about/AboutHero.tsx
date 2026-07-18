import { useTranslation } from 'react-i18next'

export function AboutHero() {
  const { t } = useTranslation()

  return (
    <header className="about-page-header">
      <h1 className="about-page-title">{t('about.title')}</h1>
      <div className="about-page-divider" aria-hidden />
      <p className="about-page-subtitle">{t('about.subtitle')}</p>
    </header>
  )
}
