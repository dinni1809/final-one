import { restaurantService } from './restaurantService';

export const searchService = {
  searchRestaurants: restaurantService.search,
  async getSuggestions(query: string) {
    const results = await restaurantService.search(query);
    return results.slice(0, 5).map((restaurant) => restaurant.name);
  },
};
