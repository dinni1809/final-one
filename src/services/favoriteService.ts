import { apiClient } from './api/client';

export const favoriteService = {
  async saveRestaurant(restaurantId: string) {
    try {
      await apiClient.post('/favorites/restaurants', { restaurantId });
    } catch {
      return;
    }
  },
  async removeRestaurant(restaurantId: string) {
    try {
      await apiClient.delete(`/favorites/restaurants/${restaurantId}`);
    } catch {
      return;
    }
  },
};
