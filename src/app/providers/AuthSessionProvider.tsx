import { useEffect, type ReactNode } from 'react'

import { isAuthSessionExpired } from '@/domain/auth/AuthSession'
import { restoreSessionFromToken } from '@/infrastructure/auth/authRepository'
import { useAuthStore } from '@/presentation/stores/authStore'

/**
 * Re-validates the persisted JWT against the mock user registry after Zustand
 * finishes reading localStorage, and clears the session when it expires at runtime.
 */
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const session = useAuthStore((s) => s.session)
  const setSession = useAuthStore((s) => s.setSession)
  const clearSession = useAuthStore((s) => s.clearSession)
  const setHydrated = useAuthStore((s) => s.setHydrated)
  const setAuthNotice = useAuthStore((s) => s.setAuthNotice)

  // Re-validate persisted token once storage hydration finishes.
  useEffect(() => {
    let cancelled = false

    const validate = async () => {
      const current = useAuthStore.getState().session

      if (!current?.accessToken || isAuthSessionExpired(current)) {
        if (!cancelled) {
          if (current && isAuthSessionExpired(current)) {
            clearSession()
            setAuthNotice('auth.errors.sessionExpired')
          } else if (current) {
            clearSession()
          }
          setHydrated(true)
        }
        return
      }

      const restored = await restoreSessionFromToken(current.accessToken)
      if (cancelled) return

      if (restored) {
        setSession(restored)
      } else {
        clearSession()
      }
      setHydrated(true)
    }

    if (useAuthStore.persist.hasHydrated()) {
      void validate()
      return () => {
        cancelled = true
      }
    }

    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      void validate()
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [clearSession, setAuthNotice, setHydrated, setSession])

  // Clear the session when the access token expires while the app is open.
  useEffect(() => {
    if (!session?.expiresAt) return

    const expireSession = () => {
      clearSession()
      setAuthNotice('auth.errors.sessionExpired')
    }

    const remainingMs = session.expiresAt - Date.now()
    if (remainingMs <= 0) {
      expireSession()
      return
    }

    const timerId = window.setTimeout(expireSession, remainingMs)
    return () => window.clearTimeout(timerId)
  }, [session?.accessToken, session?.expiresAt, clearSession, setAuthNotice])

  return children
}
