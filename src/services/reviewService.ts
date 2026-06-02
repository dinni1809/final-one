import type { Review, ReviewPayload } from "@/types/restaurant";

import { apiClient } from "./api/client";

type ApiEnvelope<T> = { success?: boolean; data: T };
type ApiReview = Partial<Review> & { _id?: string };

const unwrap = <T>(payload: T | ApiEnvelope<T>): T =>
  payload && typeof payload === "object" && "data" in payload
    ? (payload as ApiEnvelope<T>).data
    : (payload as T);

const normalizeReview = (item: ApiReview): Review => ({
  id:
    item.id ??
    item._id ??
    item.title?.toLowerCase().replace(/\s+/g, "-") ??
    "review",
  userName: item.userName ?? "Guest",
  rating: item.rating ?? 0,
  title: item.title ?? "",
  body: item.body ?? "",
  createdAt: item.createdAt ?? new Date().toISOString(),
});

export const reviewService = {
  async getReviews(restaurantId: string) {
    const { data } = await apiClient.get<ApiEnvelope<ApiReview[]>>(
      `/restaurants/${restaurantId}/reviews`,
    );
    return unwrap(data).map(normalizeReview);
  },
  async createReview(restaurantId: string, payload: ReviewPayload) {
    const { data } = await apiClient.post<ApiEnvelope<ApiReview>>(
      `/restaurants/${restaurantId}/reviews`,
      payload,
    );
    return normalizeReview(unwrap(data));
  },
};
