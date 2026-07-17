import { FaApple } from 'react-icons/fa'
import { IoLogoGooglePlaystore } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { FooterNewsletter } from './FooterNewsletter'
import { Logo } from './Logo'
import { SocialLinks } from './SocialLinks'

/** Short white underline under section titles. */
function SectionUnderline() {
  return <div className="footer-underline" aria-hidden />
}

/** Footer link list under a column heading. */
function FooterLinkColumn({
  title,
  links,
}: {
  title: string
  links: { to: string; label: string }[]
}) {
  return (
    <div className="footer-column">
      <h3 className="footer-heading">{title}</h3>
      <SectionUnderline />
      <ul className="footer-links">
        {links.map((link) => (
          <li key={`${link.to}-${link.label}`}>
            <Link to={link.to} className="footer-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="footer-newsletter-wrap">
        <FooterNewsletter />
      </div>

      <div className="footer-panel">
        <div className="footer-columns">
          {/* Brand — centered on small screens */}
          <div className="footer-brand">
            <div className="footer-brand-identity">
              <Logo variant="onPrimary" />
              <SectionUnderline />
            </div>
            <p className="footer-slug">{t('app.slug')}</p>
            <SocialLinks />
          </div>

          {/* Useful + Help share a 2-col grid on small screens */}
          <div className="footer-nav-grid">
            <FooterLinkColumn
              title={t('footer.usefulLinks')}
              links={[
                { to: '/about', label: t('footer.about') },
                { to: '/partners', label: t('footer.partners') },
                { to: '/contact', label: t('footer.contact') },
              ]}
            />

            <FooterLinkColumn
              title={t('footer.help')}
              links={[
                { to: '/faq', label: t('footer.faq') },
                { to: '/terms', label: t('footer.terms') },
                { to: '/policy', label: t('footer.policy') },
                { to: '/privacy', label: t('footer.privacy') },
              ]}
            />
          </div>

          {/* Download the app */}
          <div className="footer-column footer-download">
            <h3 className="footer-heading">{t('footer.downloadApp')}</h3>
            <SectionUnderline />
            <div className="footer-stores">
              <a
                href="#"
                aria-label={t('footer.appStore')}
                className="footer-store-badge"
              >
                <FaApple className="footer-store-badge-icon" aria-hidden />
                <span className="footer-store-badge-text">
                  <span className="footer-store-badge-caption">
                    {t('footer.appStoreCaption')}
                  </span>
                  <span className="footer-store-badge-name">
                    {t('footer.appStoreName')}
                  </span>
                </span>
              </a>
              <a
                href="#"
                aria-label={t('footer.googlePlay')}
                className="footer-store-badge"
              >
                <IoLogoGooglePlaystore
                  className="footer-store-badge-icon"
                  aria-hidden
                />
                <span className="footer-store-badge-text">
                  <span className="footer-store-badge-caption">
                    {t('footer.googlePlayCaption')}
                  </span>
                  <span className="footer-store-badge-name">
                    {t('footer.googlePlayName')}
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bar">
          <p>{t('footer.copyright')}</p>
          <p className="footer-bar-legal">{t('footer.termsPrivacy')}</p>
        </div>
      </div>
    </footer>
  )
}
