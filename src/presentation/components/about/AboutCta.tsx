import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function AboutCta() {
  const { t } = useTranslation()

  return (
    <section className="about-cta" aria-labelledby="about-cta-title">
      <div className="about-cta-copy">
        <h2 id="about-cta-title" className="about-cta-title">
          {t('about.cta.title')}
        </h2>
        <p className="about-cta-text">{t('about.cta.description')}</p>
      </div>
      <Link to="/contact" className="about-cta-link">
        {t('about.cta.action')}
      </Link>
    </section>
  )
}
