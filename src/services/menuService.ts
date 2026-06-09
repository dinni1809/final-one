import type { MenuCategory, MenuItem } from "@/types/restaurant";
import { getImageUri } from "@/utils/format";

import { apiClient } from "./api/client";

type ApiEnvelope<T> = { success?: boolean; data: T };
type ApiMenuItem = Partial<MenuItem> & {
  _id?: string;
  restaurant?: string;
  image_url?: string;
  dish_image?: string;
  photo?: string;
  imageUrl?: string;
  variants?: string[];
};

const unwrap = <T>(payload: T | ApiEnvelope<T>): T =>
  payload && typeof payload === "object" && "data" in payload
    ? (payload as ApiEnvelope<T>).data
    : (payload as T);

const normalizeCategory = (cat?: string): Exclude<MenuCategory, "All"> => {
  const normalized = (cat ?? "").trim().toLowerCase();
  if (!normalized) return "Mains";

  if (
    normalized.includes("starter") ||
    normalized.includes("antipasti") ||
    normalized.includes("sides") ||
    normalized.includes("appetizer")
  ) {
    return "Starters";
  }

  if (
    normalized.includes("dessert") ||
    normalized.includes("sweet")
  ) {
    return "Desserts";
  }

  if (
    normalized.includes("drink") ||
    normalized.includes("beverage") ||
    normalized.includes("juice") ||
    normalized.includes("soda") ||
    normalized.includes("water")
  ) {
    return "Beverages";
  }

  return "Mains";
};

const getMenuFallbackImage = (name: string, description: string, category: string): string => {
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();
  const lowerCat = category.toLowerCase();

  if (lowerName.includes("biryani") || lowerDesc.includes("biryani")) {
    return getImageUri("photo-1633945274405-b6c8069047b0", 620, 420);
  }
  if (lowerName.includes("pizza") || lowerDesc.includes("pizza")) {
    return getImageUri("photo-1513104890138-7c749659a591", 620, 420);
  }
  if (lowerName.includes("burger") || lowerDesc.includes("burger")) {
    return getImageUri("photo-1568901346375-23c9450c58cd", 620, 420);
  }
  if (
    lowerName.includes("coffee") ||
    lowerDesc.includes("coffee") ||
    lowerName.includes("cappuccino") ||
    lowerName.includes("latte") ||
    lowerName.includes("espresso") ||
    lowerName.includes("macchiato")
  ) {
    return getImageUri("photo-1509042239860-f550ce710b93", 620, 420);
  }
  if (
    lowerName.includes("chicken") ||
    lowerDesc.includes("chicken") ||
    lowerName.includes("mutton") ||
    lowerDesc.includes("mutton") ||
    lowerName.includes("kebab") ||
    lowerDesc.includes("kebab") ||
    lowerName.includes("meat") ||
    lowerDesc.includes("meat")
  ) {
    return getImageUri("photo-1604503468506-a8da13d82791", 620, 420);
  }
  if (
    lowerName.includes("paneer") ||
    lowerDesc.includes("paneer") ||
    lowerName.includes("tofu") ||
    lowerDesc.includes("tofu")
  ) {
    return getImageUri("photo-1631452180519-c014fe946bc7", 620, 420);
  }
  if (
    lowerCat.includes("dessert") ||
    lowerName.includes("dessert") ||
    lowerDesc.includes("dessert") ||
    lowerName.includes("ice cream") ||
    lowerDesc.includes("ice cream") ||
    lowerName.includes("cake") ||
    lowerDesc.includes("cake") ||
    lowerName.includes("waffle") ||
    lowerDesc.includes("waffle") ||
    lowerName.includes("chocolate") ||
    lowerDesc.includes("chocolate") ||
    lowerName.includes("shake") ||
    lowerDesc.includes("shake") ||
    lowerName.includes("sweet") ||
    lowerDesc.includes("sweet")
  ) {
    return getImageUri("photo-1551024601-bec78aea704b", 620, 420);
  }

  if (lowerCat.includes("beverage") || lowerCat.includes("drink")) {
    return getImageUri("photo-1497534446932-c925b458314e", 620, 420);
  }

  return getImageUri("photo-1546069901-ba9599a7e63c", 620, 420);
};

const normalizeMenuItem = (
  item: ApiMenuItem,
  restaurantId: string,
): MenuItem => {
  const name = item.name ?? "Menu item";
  const description = item.description ?? "";
  const category = normalizeCategory(item.category as string);
  const rawImage = item.image_url ?? item.image ?? item.dish_image ?? item.photo ?? item.imageUrl;
  const image = rawImage && rawImage.trim() ? rawImage : getMenuFallbackImage(name, description, category);
  const variants = item.variants ?? item.portions ?? [];
  const portions = item.portions ?? item.variants ?? [];

  return {
    id:
      item.id ??
      item._id ??
      item.name?.toLowerCase().replace(/\s+/g, "-") ??
      "menu-item",
    restaurantId: item.restaurantId ?? item.restaurant ?? restaurantId,
    name,
    description,
    price: item.price ?? 0,
    category,
    image,
    portions,
    variants,
  };
};


export const menuService = {
  async getMenu(restaurantId: string, category: MenuCategory = "All") {
    const { data } = await apiClient.get<
      ApiEnvelope<ApiMenuItem[]> | ApiMenuItem[]
    >(`/menu/${restaurantId}`);
    const items = unwrap(data).map((item) =>
      normalizeMenuItem(item, restaurantId),
    );
    return category === "All"
      ? items
      : items.filter((item) => item.category === category);
  },
};
