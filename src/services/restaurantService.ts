import { restaurants } from '@/data/mock/restaurants';
import type { Restaurant, RestaurantFilters } from '@/types/restaurant';

import { apiClient } from './api/client';

const applyFilters = (items: Restaurant[], filters?: RestaurantFilters) =>
  items.filter((item) => {
    if (filters?.area && item.area !== filters.area) return false;
    if (filters?.cuisine && !item.cuisines.includes(filters.cuisine)) return false;
    if (filters?.style && item.style !== filters.style) return false;
    if (filters?.price && item.priceCategory !== filters.price) return false;
    return true;
  });

export const restaurantService = {
  async getRestaurants(filters?: RestaurantFilters) {
    try {
      const { data } = await apiClient.get<Restaurant[]>('/restaurants/filter', { params: filters });
      return data;
    } catch {
      return applyFilters(restaurants, filters);
    }
  },
  async getRestaurantById(id: string) {
    try {
      const { data } = await apiClient.get<Restaurant>(`/restaurants/${id}`);
      return data;
    } catch {
      return restaurants.find((restaurant) => restaurant.id === id) ?? restaurants[0];
    }
  },
  async getTopRated() {
    try {
      const { data } = await apiClient.get<Restaurant[]>('/restaurants/top-rated');
      return data;
    } catch {
      return [...restaurants].sort((a, b) => b.rating - a.rating);
    }
  },
  async getFeatured() {
    try {
      const { data } = await apiClient.get<Restaurant[]>('/restaurants/featured');
      return data;
    } catch {
      return restaurants.filter((restaurant) => restaurant.featured);
    }
  },
  async search(query: string) {
    try {
      const { data } = await apiClient.get<Restaurant[]>('/restaurants/search', { params: { q: query } });
      return data;
    } catch {
      const normalized = query.trim().toLowerCase();
      return restaurants.filter(
        (item) =>
          item.name.toLowerCase().includes(normalized) ||
          item.area.toLowerCase().includes(normalized) ||
          item.cuisines.some((cuisine) => cuisine.toLowerCase().includes(normalized)),
      );
    }
  },
};
