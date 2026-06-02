import { create } from 'zustand';

import type { RestaurantFilters } from '@/types/restaurant';

type FilterState = {
  filters: RestaurantFilters;
  setFilter: <K extends keyof RestaurantFilters>(key: K, value: RestaurantFilters[K]) => void;
  clearFilters: () => void;
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: {},
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  clearFilters: () => set({ filters: {} }),
}));
