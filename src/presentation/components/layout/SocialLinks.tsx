import type { IconType } from 'react-icons'
import { FaFacebookF, FaInstagram, FaTelegramPlane } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'

const SOCIAL_LINKS: {
  key: string
  href: string
  labelKey: string
  Icon: IconType
  className: string
}[] = [
  {
    key: 'facebook',
    href: '#',
    labelKey: 'footer.social.facebook',
    Icon: FaFacebookF,
    className: 'footer-social-link footer-social-link--facebook',
  },
  {
    key: 'x',
    href: '#',
    labelKey: 'footer.social.x',
    Icon: FaXTwitter,
    className: 'footer-social-link footer-social-link--x',
  },
  {
    key: 'instagram',
    href: '#',
    labelKey: 'footer.social.instagram',
    Icon: FaInstagram,
    className: 'footer-social-link footer-social-link--instagram',
  },
  {
    key: 'telegram',
    href: '#',
    labelKey: 'footer.social.telegram',
    Icon: FaTelegramPlane,
    className: 'footer-social-link footer-social-link--telegram',
  },
]

export function SocialLinks() {
  const { t } = useTranslation()

  return (
    <ul className="footer-social">
      {SOCIAL_LINKS.map(({ key, href, labelKey, Icon, className }) => (
        <li key={key}>
          <a href={href} aria-label={t(labelKey)} className={className}>
            <Icon aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  )
}
