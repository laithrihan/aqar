import type { IconType } from 'react-icons'
import {
  HiOutlineHome,
  HiOutlineLocationMarker,
  HiOutlineShieldCheck,
} from 'react-icons/hi'
import { useTranslation } from 'react-i18next'

import type { AboutValue } from '@/domain/about/AboutContent'

const VALUE_ICONS: Record<AboutValue['icon'], IconType> = {
  home: HiOutlineHome,
  shield: HiOutlineShieldCheck,
  map: HiOutlineLocationMarker,
}

type AboutValuesProps = {
  values: AboutValue[]
}

export function AboutValues({ values }: AboutValuesProps) {
  const { t } = useTranslation()

  return (
    <section className="about-values" aria-labelledby="about-values-title">
      <div className="about-values-intro">
        <h2 id="about-values-title" className="about-values-title">
          {t('about.values.title')}
        </h2>
        <p className="about-values-subtitle">{t('about.values.subtitle')}</p>
      </div>

      <ul className="about-values-list">
        {values.map((value) => {
          const Icon = VALUE_ICONS[value.icon]

          return (
            <li key={value.id} className="about-values-item">
              <span className="about-values-icon" aria-hidden>
                <Icon />
              </span>
              <h3 className="about-values-item-title">{t(value.titleKey)}</h3>
              <p className="about-values-item-text">{t(value.descriptionKey)}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
