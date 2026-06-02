import { apiClient } from './api/client';

export type RestaurantVideo = {
  id: string;
  restaurantId: string;
  title: string;
  url: string;
  thumbnail: string;
};

export const videoService = {
  async getRestaurantVideo(restaurantId: string, thumbnail: string): Promise<RestaurantVideo> {
    try {
      const { data } = await apiClient.get<RestaurantVideo>(`/restaurants/${restaurantId}/video`);
      return data;
    } catch {
      return {
        id: `${restaurantId}-video`,
        restaurantId,
        title: 'FAATTSOO Experience Video',
        url: 'https://example.com/video.mp4',
        thumbnail,
      };
    }
  },
};
