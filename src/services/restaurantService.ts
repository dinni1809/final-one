import { restaurants } from '@/data/mock/restaurants';
import type { Restaurant, RestaurantFilters } from '@/types/restaurant';
import { getImageUri } from '@/utils/format';

import { apiClient } from './api/client';

type ApiEnvelope<T> = { success?: boolean; data: T };
type ApiList<T> = T[] | { items: T[]; total?: number; page?: number; limit?: number };
type ApiRestaurant = Partial<Omit<Restaurant, 'id' | 'cuisines' | 'featured'>> & {
  _id?: string;
  id?: string;
  cuisine?: string[];
  cuisines?: string[];
  isFeatured?: boolean;
  featured?: boolean;
};
type ApiRestaurantDetails = ApiRestaurant | { restaurant: ApiRestaurant };

const unwrap = <T>(payload: T | ApiEnvelope<T>): T =>
  payload && typeof payload === 'object' && 'data' in payload ? (payload as ApiEnvelope<T>).data : (payload as T);

const unwrapList = (payload: ApiEnvelope<ApiList<ApiRestaurant>> | ApiList<ApiRestaurant>): ApiRestaurant[] => {
  const data = unwrap(payload);
  return Array.isArray(data) ? data : data.items;
};

const normalizeRestaurant = (item: ApiRestaurant): Restaurant => {
  const id = item.id ?? item._id ?? item.name?.toLowerCase().replace(/\s+/g, '-') ?? 'restaurant';
  const cuisines = item.cuisines ?? item.cuisine ?? [];
  const image = item.image || getImageUri('photo-1517248135467-4c7edcad34c4');

  return {
    id,
    name: item.name ?? 'Restaurant',
    cuisines,
    area: item.area ?? 'Bangalore',
    city: item.city ?? 'Bangalore',
    rating: item.rating ?? 0,
    reviewCount: item.reviewCount ?? 0,
    priceLevel: item.priceLevel ?? Math.max(1, ['Budget', 'Mid', 'Premium', 'Luxury'].indexOf(item.priceCategory ?? 'Mid') + 1),
    priceCategory: item.priceCategory ?? 'Mid',
    style: item.style ?? 'Restaurant',
    description: item.description ?? 'Explore this restaurant on FAATTSOO.',
    image,
    coverImage: item.coverImage ?? image,
    openNow: item.openNow ?? true,
    timings: item.timings ?? '11:00 AM - 11:00 PM',
    website: item.website ?? 'https://faattsoo.local',
    featured: item.featured ?? item.isFeatured,
  };
};

const cleanFilters = (filters?: RestaurantFilters) =>
  Object.fromEntries(Object.entries(filters ?? {}).filter(([, value]) => Boolean(value)));

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
      const { data } = await apiClient.get<ApiEnvelope<ApiList<ApiRestaurant>> | ApiList<ApiRestaurant>>('/restaurants/filter', {
        params: cleanFilters(filters),
      });
      return unwrapList(data).map(normalizeRestaurant);
    } catch {
      return applyFilters(restaurants, filters);
    }
  },
  async getRestaurantById(id: string) {
    try {
      const { data } = await apiClient.get<ApiEnvelope<ApiRestaurantDetails> | ApiRestaurantDetails>(`/restaurants/${id}`);
      const details = unwrap(data);
      return normalizeRestaurant('restaurant' in details ? details.restaurant : details);
    } catch {
      return restaurants.find((restaurant) => restaurant.id === id) ?? restaurants[0];
    }
  },
  async getTopRated() {
    try {
      const { data } = await apiClient.get<ApiEnvelope<ApiList<ApiRestaurant>> | ApiList<ApiRestaurant>>('/restaurants/top-rated');
      return unwrapList(data).map(normalizeRestaurant);
    } catch {
      return [...restaurants].sort((a, b) => b.rating - a.rating);
    }
  },
  async getFeatured() {
    try {
      const { data } = await apiClient.get<ApiEnvelope<ApiList<ApiRestaurant>> | ApiList<ApiRestaurant>>('/restaurants/featured');
      return unwrapList(data).map(normalizeRestaurant);
    } catch {
      return restaurants.filter((restaurant) => restaurant.featured);
    }
  },
  async search(query: string) {
    try {
      const { data } = await apiClient.get<ApiEnvelope<ApiList<ApiRestaurant>> | ApiList<ApiRestaurant>>('/restaurants/search', {
        params: { q: query },
      });
      return unwrapList(data).map(normalizeRestaurant);
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
