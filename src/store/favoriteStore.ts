import { create } from 'zustand';

import { favoriteService } from '@/services/favoriteService';

type FavoriteState = {
  restaurantIds: string[];
  menuItemIds: string[];
  toggleRestaurant: (restaurantId: string) => Promise<void>;
  toggleMenuItem: (menuItemId: string) => void;
  isRestaurantFavorite: (restaurantId: string) => boolean;
  isMenuItemFavorite: (menuItemId: string) => boolean;
};

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  restaurantIds: ['olive-bistro'],
  menuItemIds: [],
  async toggleRestaurant(restaurantId) {
    const exists = get().restaurantIds.includes(restaurantId);
    set({
      restaurantIds: exists
        ? get().restaurantIds.filter((id) => id !== restaurantId)
        : [...get().restaurantIds, restaurantId],
    });
    if (exists) {
      await favoriteService.removeRestaurant(restaurantId);
    } else {
      await favoriteService.saveRestaurant(restaurantId);
    }
  },
  toggleMenuItem(menuItemId) {
    const exists = get().menuItemIds.includes(menuItemId);
    set({
      menuItemIds: exists ? get().menuItemIds.filter((id) => id !== menuItemId) : [...get().menuItemIds, menuItemId],
    });
  },
  isRestaurantFavorite: (restaurantId) => get().restaurantIds.includes(restaurantId),
  isMenuItemFavorite: (menuItemId) => get().menuItemIds.includes(menuItemId),
}));
