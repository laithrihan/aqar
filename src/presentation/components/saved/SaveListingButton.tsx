import type { MouseEvent } from 'react'
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

import {
  useIsListingSaved,
  useToggleSavedListing,
} from '@/presentation/hooks/useSavedListings'
import { useAuthStore } from '@/presentation/stores/authStore'
import { useAuthUiStore } from '@/presentation/stores/authUiStore'
import { cn } from '@/shared/lib/cn'

type SaveListingButtonProps = {
  listingId: string
  variant?: 'overlay' | 'detail'
  className?: string
}


export function SaveListingButton({
  listingId,
  variant = 'overlay',
  className,
}: SaveListingButtonProps) {
  const { t } = useTranslation()
  const session = useAuthStore((s) => s.session)
  const hydrated = useAuthStore((s) => s.hydrated)
  const openLogin = useAuthUiStore((s) => s.openLogin)
  const saved = useIsListingSaved(listingId)
  const toggleSave = useToggleSavedListing()

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()

    if (!hydrated) return

    if (!session) {
      openLogin()
      return
    }

    toggleSave.mutate(listingId)
  }

  const label = saved ? t('saved.unsave') : t('saved.save')
  const Icon = saved ? MdFavorite : MdFavoriteBorder

  return (
    <button
      type="button"
      className={cn(
        variant === 'overlay' ? 'save-listing-btn' : 'save-listing-btn-detail',
        saved && 'save-listing-btn--saved',
        className,
      )}
      aria-label={label}
      aria-pressed={saved}
      disabled={!hydrated || toggleSave.isPending}
      onClick={handleClick}
    >
      <Icon aria-hidden className="size-5" />
      {variant === 'detail' ? <span>{label}</span> : null}
    </button>
  )
}
