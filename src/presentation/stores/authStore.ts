import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthSession } from '@/domain/auth/AuthSession'

type AuthStore = {
  session: AuthSession | null
  hydrated: boolean
  authNotice: string | null
  setSession: (session: AuthSession) => void
  clearSession: () => void
  setHydrated: (hydrated: boolean) => void
  setAuthNotice: (notice: string | null) => void
}

/**
 * Presentation-only session state. Token restore / expiry live in
 * AuthSessionProvider so this store does not depend on infrastructure.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      hydrated: false,
      authNotice: null,
      setSession: (session) => set({ session, authNotice: null }),
      clearSession: () => set({ session: null }),
      setHydrated: (hydrated) => set({ hydrated }),
      setAuthNotice: (authNotice) => set({ authNotice }),
    }),
    {
      name: 'aqar-auth-session',
      // Persist only the session — ephemeral flags stay in memory.
      partialize: (state) => ({ session: state.session }),
    },
  ),
)
