export interface TrendingCategory {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  description: string;
  restaurantNames: string[];
}

export const TRENDING_CATEGORIES: TrendingCategory[] = [
  {
    id: "best-biryani",
    name: "Best Biryani",
    subtitle: "Hand-picked by FAATTSOO",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&h=400&q=82",
    description: "Indulge in Bangalore's finest, most aromatic biryani hotspots.",
    restaurantNames: ["Meghana Biryani", "Mallika Biryani", "Shivaji Military Hotel"],
  },
  {
    id: "best-buffet",
    name: "Best Buffet",
    subtitle: "Hand-picked by FAATTSOO",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&h=400&q=82",
    description: "Grand spreads and unlimited feasts for your family gatherings.",
    restaurantNames: ["AB's BBQ", "Revival - Marriott"],
  },
  {
    id: "best-cafe",
    name: "Best Cafe",
    subtitle: "Hand-picked by FAATTSOO",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&h=400&q=82",
    description: "Cozy corners, aromatic custom brews, and delicious quick bites.",
    restaurantNames: ["Glen's Bakehouse", "Truffles"],
  },
  {
    id: "best-date-night",
    name: "Best Date Night",
    subtitle: "Hand-picked by FAATTSOO",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&h=400&q=82",
    description: "Romantic settings, intimate lighting, and curated fine dining.",
    restaurantNames: ["Naru", "Foglia", "Saffron & Smoke"],
  },
  {
    id: "best-dessert-spot",
    name: "Best Dessert Spot",
    subtitle: "Hand-picked by FAATTSOO",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&h=400&q=82",
    description: "Satisfy your sweet cravings with Bangalore's top dessert parlors.",
    restaurantNames: ["Corner House", "Magnolia Bakery", "Frozen Bottle"],
  },
  {
    id: "best-family-restaurant",
    name: "Best Family Restaurant",
    subtitle: "Hand-picked by FAATTSOO",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&h=400&q=82",
    description: "Spacious seating, diverse menus, and warm dining hospitalities.",
    restaurantNames: ["Empire Restaurant", "NAVAYUGA", "Swathi Restaurant", "Kritunga", "Shetty Lunch Home"],
  },
  {
    id: "best-andhra-food",
    name: "Best Andhra Food",
    subtitle: "Hand-picked by FAATTSOO",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&h=400&q=82",
    description: "Spicy traditional curries, aromatic meals, and authentic hot spices.",
    restaurantNames: ["Nagarjuna's", "NAVAYUGA"],
  },
];
