import { apiClient } from "./api/client";

type ApiEnvelope<T> = { success?: boolean; data: T };

const unwrap = <T>(payload: T | ApiEnvelope<T>): T =>
  payload && typeof payload === "object" && "data" in payload
    ? (payload as ApiEnvelope<T>).data
    : (payload as T);

export const adminService = {
  // Restaurants CRUD
  async addRestaurant(data: any) {
    const res = await apiClient.post<any>("/admin/restaurants", data);
    return unwrap(res.data);
  },
  async editRestaurant(id: string, data: any) {
    const res = await apiClient.put<any>(`/admin/restaurants/${id}`, data);
    return unwrap(res.data);
  },
  async deleteRestaurant(id: string) {
    const res = await apiClient.delete<any>(`/admin/restaurants/${id}`);
    return unwrap(res.data);
  },

  // Menu Items CRUD
  async addMenuItem(data: any) {
    const res = await apiClient.post<any>("/admin/menu", data);
    return unwrap(res.data);
  },
  async editMenuItem(id: string, data: any) {
    const res = await apiClient.put<any>(`/admin/menu/${id}`, data);
    return unwrap(res.data);
  },
  async deleteMenuItem(id: string) {
    const res = await apiClient.delete<any>(`/admin/menu/${id}`);
    return unwrap(res.data);
  },

  // Offers CRUD
  async getOffers() {
    const res = await apiClient.get<any>("/admin/offers");
    return unwrap(res.data);
  },
  async addOffer(data: any) {
    const res = await apiClient.post<any>("/admin/offers", data);
    return unwrap(res.data);
  },
  async editOffer(id: string, data: any) {
    const res = await apiClient.put<any>(`/admin/offers/${id}`, data);
    return unwrap(res.data);
  },
  async deleteOffer(id: string) {
    const res = await apiClient.delete<any>(`/admin/offers/${id}`);
    return unwrap(res.data);
  },

  // Reviews CRUD
  async getReviews() {
    const res = await apiClient.get<any>("/admin/reviews");
    return unwrap(res.data);
  },
  async deleteReview(id: string) {
    const res = await apiClient.delete<any>(`/admin/reviews/${id}`);
    return unwrap(res.data);
  },
};
