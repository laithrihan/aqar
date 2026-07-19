import { useGoogleLogin } from '@react-oauth/google'
import { useState, type ReactNode } from 'react'

import { hasGoogleClientId } from '@/shared/lib/googleClientId'

type GoogleAuthActionButtonProps = {
  className?: string
  children: ReactNode
  disabled?: boolean
  onBeforeStart?: () => boolean
  onAccessToken: (accessToken: string) => void | Promise<void>
  onError: (errorKey: string) => void
  onPendingChange?: (pending: boolean) => void
}


export function GoogleAuthActionButton({
  className,
  children,
  disabled,
  onBeforeStart,
  onAccessToken,
  onError,
  onPendingChange,
}: GoogleAuthActionButtonProps) {
  if (!hasGoogleClientId()) {
    return (
      <button
        type="button"
        className={className}
        disabled={disabled}
        onClick={() => {
          if (onBeforeStart && !onBeforeStart()) return
          onError('auth.errors.googleClientIdMissing')
        }}
      >
        {children}
      </button>
    )
  }

  return (
    <GoogleAuthActionButtonConnected
      className={className}
      disabled={disabled}
      onBeforeStart={onBeforeStart}
      onAccessToken={onAccessToken}
      onError={onError}
      onPendingChange={onPendingChange}
    >
      {children}
    </GoogleAuthActionButtonConnected>
  )
}

function GoogleAuthActionButtonConnected({
  className,
  children,
  disabled,
  onBeforeStart,
  onAccessToken,
  onError,
  onPendingChange,
}: GoogleAuthActionButtonProps) {
  const [pending, setPending] = useState(false)

  const setBusy = (next: boolean) => {
    setPending(next)
    onPendingChange?.(next)
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setBusy(true)
      try {
        await onAccessToken(tokenResponse.access_token)
      } catch {
        onError('auth.errors.googleFailed')
      } finally {
        setBusy(false)
      }
    },
    onError: () => {
      setBusy(false)
      onError('auth.errors.googleFailed')
    },
    onNonOAuthError: () => {
      setBusy(false)
      onError('auth.errors.googleCancelled')
    },
  })

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || pending}
      onClick={() => {
        if (onBeforeStart && !onBeforeStart()) return
        setBusy(true)
        googleLogin()
      }}
    >
      {children}
    </button>
  )
}
