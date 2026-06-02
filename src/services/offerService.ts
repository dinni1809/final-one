import { offers } from '@/data/mock/restaurants';

import { apiClient } from './api/client';

export const offerService = {
  async getTopOffers() {
    try {
      const { data } = await apiClient.get<typeof offers>('/offers');
      return data;
    } catch {
      return offers;
    }
  },
};
