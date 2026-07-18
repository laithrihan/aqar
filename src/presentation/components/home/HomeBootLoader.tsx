import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Spinner } from '@/components/ui/spinner'
import { LogoMark } from '@/presentation/components/layout/LogoMark'
import { useAppBootStore } from '@/presentation/stores/appBootStore'

type HomeBootLoaderProps = {
  /** True while the home page's initial data is still loading. */
  isBooting: boolean
}

/**
 * Full-screen loader shown only on the first home page render of the SPA session.
 * Does not reappear when navigating back to home.
 */
export function HomeBootLoader({ isBooting }: HomeBootLoaderProps) {
  const { t } = useTranslation()
  const hasCompletedInitialBoot = useAppBootStore((s) => s.hasCompletedInitialBoot)
  const completeInitialBoot = useAppBootStore((s) => s.completeInitialBoot)

  useEffect(() => {
    if (hasCompletedInitialBoot || isBooting) return
    completeInitialBoot()
  }, [hasCompletedInitialBoot, isBooting, completeInitialBoot])

  if (hasCompletedInitialBoot) return null

  return (
    <div className="app-boot-loader" aria-busy="true">
      <div className="app-boot-loader-brand">
        <LogoMark className="app-boot-loader-mark" />
        <span className="app-boot-loader-name">{t('app.name')}</span>
      </div>
      <div className="app-boot-loader-status">
        <Spinner className="size-10 text-secondary" aria-label={t('common.loading')} />
        <p className="app-boot-loader-label">{t('common.loading')}</p>
      </div>
    </div>
  )
}
