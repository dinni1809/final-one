import type { RatingSummary } from "@/types/restaurant";

import { apiClient } from "./api/client";

type ApiEnvelope<T> = { success?: boolean; data: T };

const unwrap = <T>(payload: T | ApiEnvelope<T>): T =>
  payload && typeof payload === "object" && "data" in payload
    ? (payload as ApiEnvelope<T>).data
    : (payload as T);

export const ratingService = {
  async getSummary(restaurantId: string) {
    const { data } = await apiClient.get<ApiEnvelope<RatingSummary>>(
      `/restaurants/${restaurantId}/ratings`,
    );
    return unwrap(data);
  },
};
