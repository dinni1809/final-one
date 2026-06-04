import type { MenuCategory, MenuItem } from "@/types/restaurant";
import { getImageUri } from "@/utils/format";

import { apiClient } from "./api/client";

type ApiEnvelope<T> = { success?: boolean; data: T };
type ApiMenuItem = Partial<MenuItem> & {
  _id?: string;
  restaurant?: string;
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

const normalizeMenuItem = (
  item: ApiMenuItem,
  restaurantId: string,
): MenuItem => ({
  id:
    item.id ??
    item._id ??
    item.name?.toLowerCase().replace(/\s+/g, "-") ??
    "menu-item",
  restaurantId: item.restaurantId ?? item.restaurant ?? restaurantId,
  name: item.name ?? "Menu item",
  description: item.description ?? "",
  price: item.price ?? 0,
  category: normalizeCategory(item.category as string),
  image: item.image ?? getImageUri("photo-1546069901-ba9599a7e63c", 620, 420),
  portions: item.portions ?? ["Regular"],
});


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
