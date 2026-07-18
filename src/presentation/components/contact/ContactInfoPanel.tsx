import type { IconType } from 'react-icons'
import {
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
} from 'react-icons/hi'
import { useTranslation } from 'react-i18next'

import type { ContactInfo } from '@/domain/contact/ContactMessage'
import { SocialLinks } from '@/presentation/components/layout/SocialLinks'
import { Skeleton } from '@/components/ui/skeleton'

type ContactInfoPanelProps = {
  info: ContactInfo | undefined
  isLoading: boolean
  isError: boolean
}

type InfoRow = {
  key: string
  Icon: IconType
  labelKey: string
  value: string
  href?: string
}

export function ContactInfoPanel({
  info,
  isLoading,
  isError,
}: ContactInfoPanelProps) {
  const { t } = useTranslation()

  const rows: InfoRow[] = info
    ? [
        {
          key: 'email',
          Icon: HiOutlineMail,
          labelKey: 'contact.info.email',
          value: info.email,
          href: `mailto:${info.email}`,
        },
        {
          key: 'phone',
          Icon: HiOutlinePhone,
          labelKey: 'contact.info.phone',
          value: info.phone,
          href: `tel:${info.phone.replace(/\s/g, '')}`,
        },
        {
          key: 'address',
          Icon: HiOutlineLocationMarker,
          labelKey: 'contact.info.address',
          value: t(info.addressKey),
        },
        {
          key: 'hours',
          Icon: HiOutlineClock,
          labelKey: 'contact.info.hours',
          value: t(info.hoursKey),
        },
      ]
    : []

  return (
    <aside className="contact-info" aria-label={t('contact.info.label')}>
      <div className="contact-info-intro">
        <h2 className="contact-info-title">{t('contact.info.title')}</h2>
        <p className="contact-info-text">{t('contact.info.description')}</p>
      </div>

      {isLoading && (
        <ul className="contact-info-list" aria-busy="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="contact-info-row">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-40" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {isError && (
        <p className="contact-info-error" role="alert">
          {t('contact.info.error')}
        </p>
      )}

      {!isLoading && !isError && (
        <ul className="contact-info-list">
          {rows.map(({ key, Icon, labelKey, value, href }) => (
            <li key={key} className="contact-info-row">
              <span className="contact-info-icon" aria-hidden>
                <Icon />
              </span>
              <div className="contact-info-body">
                <span className="contact-info-label">{t(labelKey)}</span>
                {href ? (
                  <a href={href} className="contact-info-value contact-info-link">
                    {value}
                  </a>
                ) : (
                  <span className="contact-info-value">{value}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="contact-info-social">
        <p className="contact-info-social-label">{t('contact.info.follow')}</p>
        <SocialLinks />
      </div>
    </aside>
  )
}
