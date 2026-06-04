import type { Restaurant, RestaurantFilters, PriceCategory } from "@/types/restaurant";
import {
  normalizeAreaValue,
  normalizeCuisineValues,
  restaurantMatchesArea,
  restaurantMatchesCuisine,
  splitCommaSeparatedValues,
} from "@/utils/filterOptions";
import {
  logApiImageUrl,
  resolveRestaurantImageUrl,
} from "@/utils/restaurantImageAudit";

import { apiClient } from "./api/client";

type ApiEnvelope<T> = { success?: boolean; data: T };
type ApiList<T> =
  | T[]
  | { items: T[]; total?: number; page?: number; limit?: number };
type ApiRestaurant = Partial<
  Omit<Restaurant, "id" | "cuisines" | "featured">
> & {
  _id?: string;
  id?: string;
  slug?: string;
  cuisine?: string | string[];
  cuisines?: string | string[];
  image_url?: string | null;
  banner_image_url?: string | null;
  bannerImageUrl?: string | null;
  isFeatured?: boolean;
  featured?: boolean;
  price_range?: string;
  faattsoo_rating?: number;
};
type ApiRestaurantDetails = ApiRestaurant | { restaurant: ApiRestaurant };
type ApiFilterOptions = {
  areas: string[];
  cuisines: string[];
  styles: string[];
  prices: string[];
};

const unwrap = <T>(payload: T | ApiEnvelope<T>): T =>
  payload && typeof payload === "object" && "data" in payload
    ? (payload as ApiEnvelope<T>).data
    : (payload as T);

const unwrapList = (
  payload: ApiEnvelope<ApiList<ApiRestaurant>> | ApiList<ApiRestaurant>,
): ApiRestaurant[] => {
  const data = unwrap(payload);
  return Array.isArray(data) ? data : data.items;
};

const normalizeRestaurant = (item: ApiRestaurant): Restaurant => {
  const id =
    item.id ??
    item._id ??
    item.slug ??
    item.name?.toLowerCase().replace(/\s+/g, "-") ??
    "restaurant";
  const cuisines = normalizeCuisineValues(item.cuisines ?? item.cuisine);
  const image = resolveRestaurantImageUrl(item);
  const name = item.name ?? "Restaurant";

  logApiImageUrl({
    restaurantId: String(id),
    restaurantName: name,
    banner_image_url: item.banner_image_url,
    bannerImageUrl: item.bannerImageUrl,
    image_url: item.image_url,
    image: item.image,
    resolvedUrl: image,
  });

  const rawPrice = item.price_range ?? item.priceCategory ?? "Mid";
  const priceMap: Record<string, PriceCategory> = {
    budget: "Budget",
    mid: "Mid",
    premium: "Premium",
    luxury: "Luxury",
    Budget: "Budget",
    Mid: "Mid",
    Premium: "Premium",
    Luxury: "Luxury",
  };
  const priceCategory = priceMap[rawPrice] ?? "Mid";

  return {
    id,
    name,
    cuisines,
    area: normalizeAreaValue(item.area),
    city: item.city ?? "Bangalore",
    rating: item.rating ?? (item.faattsoo_rating ? item.faattsoo_rating / 2 : 0),
    reviewCount: item.reviewCount ?? 0,
    priceLevel:
      item.priceLevel ??
      Math.max(
        1,
        ["Budget", "Mid", "Premium", "Luxury"].indexOf(priceCategory) + 1,
      ),
    priceCategory,
    style: item.style ?? cuisines.find((c) => ["Cafe", "Buffet", "Fine Dining", "Bakery", "Dessert"].includes(c)) ?? "Restaurant",
    description: item.description ?? "Explore this restaurant on FAATTSOO.",
    image,
    coverImage: item.coverImage ?? image,
    openNow: item.openNow ?? true,
    timings: item.timings ?? "11:00 AM - 11:00 PM",
    website: item.website ?? "https://faattsoo.local",
    featured: item.featured ?? item.isFeatured,
  };
};

const cleanFilters = (filters?: RestaurantFilters) =>
  Object.fromEntries(
    Object.entries(filters ?? {}).filter(([, value]) => Boolean(value)),
  );

export const restaurantService = {
  async getRestaurants(filters?: RestaurantFilters) {
    const { data } = await apiClient.get<
      ApiEnvelope<ApiList<ApiRestaurant>> | ApiList<ApiRestaurant>
    >("/restaurants/filter", {
      params: { ...cleanFilters(filters), limit: 50 },
    });
    return unwrapList(data).map(normalizeRestaurant);
  },
  async getRestaurantById(id: string) {
    const { data } = await apiClient.get<
      ApiEnvelope<ApiRestaurantDetails> | ApiRestaurantDetails
    >(`/restaurants/${id}`);
    const details = unwrap(data);
    return normalizeRestaurant(
      "restaurant" in details ? details.restaurant : details,
    );
  },
  async getTopRated() {
    const { data } = await apiClient.get<
      ApiEnvelope<ApiList<ApiRestaurant>> | ApiList<ApiRestaurant>
    >("/restaurants/top-rated");
    return unwrapList(data).map(normalizeRestaurant);
  },
  async getFeatured() {
    const { data } = await apiClient.get<
      ApiEnvelope<ApiList<ApiRestaurant>> | ApiList<ApiRestaurant>
    >("/restaurants/featured");
    return unwrapList(data).map(normalizeRestaurant);
  },
  async search(query: string) {
    const { data } = await apiClient.get<
      ApiEnvelope<ApiList<ApiRestaurant>> | ApiList<ApiRestaurant>
    >("/restaurants/search", {
      params: { q: query },
    });
    return unwrapList(data).map(normalizeRestaurant);
  },
  async getFilterOptions() {
    const [areasResponse, cuisinesResponse, stylesResponse, pricesResponse] =
      await Promise.all([
        apiClient.get<ApiEnvelope<string[]>>("/restaurants/areas"),
        apiClient.get<ApiEnvelope<string[]>>("/restaurants/cuisines"),
        apiClient.get<ApiEnvelope<string[]>>("/restaurants/styles"),
        apiClient.get<ApiEnvelope<string[]>>("/restaurants/prices"),
      ]);

    return {
      areas: splitCommaSeparatedValues(unwrap(areasResponse.data)),
      cuisines: splitCommaSeparatedValues(unwrap(cuisinesResponse.data)),
      styles: splitCommaSeparatedValues(unwrap(stylesResponse.data)),
      prices: splitCommaSeparatedValues(unwrap(pricesResponse.data)),
    } as ApiFilterOptions;
  },
};
