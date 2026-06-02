export type PriceCategory = "Budget" | "Mid" | "Premium" | "Luxury";

export type Restaurant = {
  id: string;
  name: string;
  cuisines: string[];
  area: string;
  city: string;
  rating: number;
  reviewCount: number;
  priceLevel: number;
  priceCategory: PriceCategory;
  style: string;
  description: string;
  image: string;
  coverImage: string;
  openNow: boolean;
  timings: string;
  website: string;
  featured?: boolean;
};

export type Offer = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  title: string;
  badge: string;
  location: string;
  validUntil: string;
  image: string;
};

export type MenuCategory =
  | "All"
  | "Starters"
  | "Mains"
  | "Desserts"
  | "Beverages";

export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<MenuCategory, "All">;
  image: string;
  portions: string[];
};

export type RatingSummary = {
  average: number;
  reviewCount: number;
  breakdown: Array<{ stars: number; percent: number }>;
};

export type Review = {
  id: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
};

export type ReviewPayload = {
  rating: number;
  title: string;
  body: string;
};

export type RestaurantFilters = {
  area?: string;
  price?: string;
  menuItem?: string;
  cuisine?: string;
  style?: string;
};
