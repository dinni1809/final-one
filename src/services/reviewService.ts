import type { Review, ReviewPayload } from "@/types/restaurant";

import { apiClient } from "./api/client";

type ApiEnvelope<T> = { success?: boolean; data: T };
type ApiReview = Partial<Review> & { _id?: string; review?: string };

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
  body: item.review ?? item.body ?? "",
  createdAt: item.createdAt ?? new Date().toISOString(),
});

export const reviewService = {
  async getReviews(restaurantId: string, sort?: string) {
    const { data } = await apiClient.get<ApiEnvelope<ApiReview[]>>(
      `/restaurants/${restaurantId}/reviews`,
      { params: { sort } }
    );
    return unwrap(data).map(normalizeReview);
  },
  async createReview(restaurantId: string, payload: ReviewPayload) {
    const { data } = await apiClient.post<ApiEnvelope<ApiReview>>(
      `/restaurants/${restaurantId}/reviews`,
      {
        rating: payload.rating,
        title: payload.title,
        review: payload.body,
      },
    );
    return normalizeReview(unwrap(data));
  },
};
