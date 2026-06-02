import { create } from "zustand";

import { favoriteService } from "@/services/favoriteService";
import type { Restaurant } from "@/types/restaurant";

type FavoriteState = {
  restaurants: Restaurant[];
  restaurantIds: string[];
  menuItemIds: string[];
  loadFavorites: () => Promise<void>;
  toggleRestaurant: (restaurantId: string) => Promise<void>;
  toggleMenuItem: (menuItemId: string) => void;
  isRestaurantFavorite: (restaurantId: string) => boolean;
  isMenuItemFavorite: (menuItemId: string) => boolean;
};

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  restaurants: [],
  restaurantIds: [],
  menuItemIds: [],
  async loadFavorites() {
    try {
      const restaurants = await favoriteService.getFavoriteRestaurants();
      set({
        restaurants,
        restaurantIds: restaurants.map((restaurant) => restaurant.id),
      });
    } catch {
      set({ restaurants: [], restaurantIds: [] });
    }
  },
  async toggleRestaurant(restaurantId) {
    const exists = get().restaurantIds.includes(restaurantId);
    set({
      restaurantIds: exists
        ? get().restaurantIds.filter((id) => id !== restaurantId)
        : [...get().restaurantIds, restaurantId],
      restaurants: get().restaurants.filter(
        (restaurant) => restaurant.id !== restaurantId,
      ),
    });

    try {
      if (exists) {
        await favoriteService.removeRestaurant(restaurantId);
      } else {
        await favoriteService.saveRestaurant(restaurantId);
      }
    } finally {
      await get().loadFavorites();
    }
  },
  toggleMenuItem(menuItemId) {
    const exists = get().menuItemIds.includes(menuItemId);
    set({
      menuItemIds: exists
        ? get().menuItemIds.filter((id) => id !== menuItemId)
        : [...get().menuItemIds, menuItemId],
    });
  },
  isRestaurantFavorite: (restaurantId) =>
    get().restaurantIds.includes(restaurantId),
  isMenuItemFavorite: (menuItemId) => get().menuItemIds.includes(menuItemId),
}));
