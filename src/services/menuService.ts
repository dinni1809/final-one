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

const fallbacks: Record<string, any> = {
  chicken: require('../../assets/chicken.png'),
  paneer: require('../../assets/paneer.png'),
  biryani: require('../../assets/biryani.png'),
  burger: require('../../assets/burger.png'),
  pizza: require('../../assets/pizza.png'),
  coffee: require('../../assets/coffee.png'),
  ice_cream: require('../../assets/ice_cream.png'),
  cake: require('../../assets/cake.png'),
  chinese: require('../../assets/chinese.png'),
  south_indian: require('../../assets/south_indian.png'),
};

const getMenuFallbackImage = (name: string, description: string, category: string): any => {
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();
  const lowerCat = category.toLowerCase();

  // 1. Biryani
  if (lowerName.includes("biryani") || lowerDesc.includes("biryani")) {
    return fallbacks.biryani;
  }
  // 2. Pizza
  if (lowerName.includes("pizza") || lowerDesc.includes("pizza")) {
    return fallbacks.pizza;
  }
  // 3. Burger
  if (lowerName.includes("burger") || lowerDesc.includes("burger")) {
    return fallbacks.burger;
  }
  // 4. Coffee
  if (
    lowerName.includes("coffee") ||
    lowerDesc.includes("coffee") ||
    lowerName.includes("cappuccino") ||
    lowerName.includes("latte") ||
    lowerName.includes("espresso") ||
    lowerName.includes("macchiato")
  ) {
    return fallbacks.coffee;
  }
  // 5. Chicken / Mutton / Meat / Kebab
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
    return fallbacks.chicken;
  }
  // 6. Paneer
  if (
    lowerName.includes("paneer") ||
    lowerDesc.includes("paneer") ||
    lowerName.includes("tofu") ||
    lowerDesc.includes("tofu")
  ) {
    return fallbacks.paneer;
  }
  // 7. Ice Cream
  if (
    lowerName.includes("ice cream") ||
    lowerDesc.includes("ice cream") ||
    lowerName.includes("sundae") ||
    lowerName.includes("fudge") ||
    lowerName.includes("scoop") ||
    lowerName.includes("scooper")
  ) {
    return fallbacks.ice_cream;
  }
  // 8. Cake
  if (
    lowerName.includes("cake") ||
    lowerDesc.includes("cake") ||
    lowerName.includes("pastry") ||
    lowerName.includes("lava") ||
    lowerName.includes("tiramisu")
  ) {
    return fallbacks.cake;
  }
  // 9. Chinese
  if (
    lowerName.includes("noodles") ||
    lowerName.includes("chinese") ||
    lowerName.includes("fried rice") ||
    lowerName.includes("manchurian") ||
    lowerName.includes("momos") ||
    lowerName.includes("dumpling")
  ) {
    return fallbacks.chinese;
  }
  // 10. South Indian
  if (
    lowerName.includes("dosa") ||
    lowerName.includes("idli") ||
    lowerName.includes("uttapam") ||
    lowerName.includes("vada") ||
    lowerName.includes("sambar") ||
    lowerName.includes("south indian")
  ) {
    return fallbacks.south_indian;
  }

  // Category based general fallbacks:
  if (lowerCat.includes("starter")) {
    return fallbacks.chicken;
  }
  if (lowerCat.includes("beverage") || lowerCat.includes("drink")) {
    return fallbacks.coffee;
  }
  if (lowerCat.includes("dessert") || lowerCat.includes("sweet")) {
    return fallbacks.cake;
  }

  return fallbacks.biryani;
};

const isValidImage = (url?: string): boolean => {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed === "" ||
    trimmed === "null" ||
    trimmed === "undefined" ||
    trimmed === "placeholder" ||
    trimmed === "default"
  ) {
    return false;
  }
  // Treat the reused donut fallback URL as missing to force high-quality local fallback mapping
  if (trimmed.includes("photo-1551024601-bec78aea704b")) {
    return false;
  }
  return /^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:image") || trimmed.includes("unsplash.com");
};

const normalizeMenuItem = (
  item: ApiMenuItem,
  restaurantId: string,
): MenuItem => {
  const name = item.name ?? "Menu item";
  const description = item.description ?? "";
  const category = normalizeCategory(item.category as string);
  const rawImage = item.image ?? item.image_url ?? item.imageUrl ?? item.dish_image ?? item.photo;
  const image = typeof rawImage === 'string' && isValidImage(rawImage)
    ? rawImage.trim()
    : (typeof rawImage === 'number' ? rawImage : getMenuFallbackImage(name, description, category));
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
