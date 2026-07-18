import { useTranslation } from 'react-i18next'

export function ContactHero() {
  const { t } = useTranslation()

  return (
    <header className="contact-page-header">
      <h1 className="contact-page-title">{t('contact.title')}</h1>
      <div className="contact-page-divider" aria-hidden />
      <p className="contact-page-subtitle">{t('contact.subtitle')}</p>
    </header>
  )
}
