import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthSession } from '@/domain/auth/AuthSession'

type AuthStore = {
  session: AuthSession | null
  setSession: (session: AuthSession) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    { name: 'aqar-auth-session' },
  ),
)
