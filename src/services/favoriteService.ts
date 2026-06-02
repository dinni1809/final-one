import type { Restaurant } from "@/types/restaurant";

import { apiClient } from "./api/client";

type ApiEnvelope<T> = { success?: boolean; data: T };

const unwrap = <T>(payload: T | ApiEnvelope<T>): T =>
  payload && typeof payload === "object" && "data" in payload
    ? (payload as ApiEnvelope<T>).data
    : (payload as T);

export const favoriteService = {
  async getFavoriteRestaurants() {
    const { data } = await apiClient.get<ApiEnvelope<Restaurant[]>>(
      "/favorites/restaurants",
    );
    return unwrap(data);
  },
  async saveRestaurant(restaurantId: string) {
    await apiClient.post("/favorites/restaurants", { restaurantId });
  },
  async removeRestaurant(restaurantId: string) {
    await apiClient.delete(`/favorites/restaurants/${restaurantId}`);
  },
};
