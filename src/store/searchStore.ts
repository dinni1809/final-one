import { create } from 'zustand';

type SearchState = {
  query: string;
  recentSearches: string[];
  setQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  recentSearches: ['Koramangala', 'Pizza', 'Cafe'],
  setQuery: (query) => set({ query }),
  addRecentSearch: (query) =>
    set((state) => ({
      recentSearches: [query, ...state.recentSearches.filter((item) => item !== query)].slice(0, 6),
    })),
  clearRecentSearches: () => set({ recentSearches: [] }),
}));
