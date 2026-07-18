import { create } from 'zustand'

type AppBootStore = {
  hasCompletedInitialBoot: boolean
  completeInitialBoot: () => void
}

/** Tracks the one-time app boot loader (first home render only). */
export const useAppBootStore = create<AppBootStore>((set) => ({
  hasCompletedInitialBoot: false,
  completeInitialBoot: () => set({ hasCompletedInitialBoot: true }),
}))
