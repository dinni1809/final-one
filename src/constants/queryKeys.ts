export const queryKeys = {
  me: ['me'],
  restaurants: ['restaurants'],
  restaurantDetails: (id: string) => ['restaurant', id],
  topRated: ['restaurants', 'top-rated'],
  featured: ['restaurants', 'featured'],
  offers: ['offers'],
  menu: (restaurantId: string) => ['menu', restaurantId],
  search: (query: string) => ['search', query],
  filters: ['filters'],
};
