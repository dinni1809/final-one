import { ratingSummary } from '@/data/mock/restaurants';

import { apiClient } from './api/client';

export const ratingService = {
  async getSummary(restaurantId: string) {
    try {
      const { data } = await apiClient.get<typeof ratingSummary>(`/restaurants/${restaurantId}/ratings`);
      return data;
    } catch {
      return ratingSummary;
    }
  },
};
