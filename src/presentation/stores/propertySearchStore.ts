import { create } from 'zustand'

import type { PropertySearchFilters } from '@/domain/home/PropertySearch'

type PropertySearchStore = {
  appliedFilters: PropertySearchFilters | null
  applyFilters: (filters: PropertySearchFilters) => void
  clearFilters: () => void
}

export const usePropertySearchStore = create<PropertySearchStore>((set) => ({
  appliedFilters: null,
  applyFilters: (filters) => set({ appliedFilters: filters }),
  clearFilters: () => set({ appliedFilters: null }),
}))
