const userRepository = require("../repositories/userRepository");
const restaurantRepository = require("../repositories/restaurantRepository");
const ApiError = require("../utils/ApiError");

exports.getFavoriteRestaurants = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  if (!user.favoriteRestaurants?.length) return [];
  return restaurantRepository.findBySlugs(user.favoriteRestaurants);
};

exports.addFavoriteRestaurant = async (userId, restaurantId) => {
  const restaurant = await restaurantRepository.findByIdOrSlug(restaurantId);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");
  return userRepository.addFavoriteRestaurant(
    userId,
    restaurant.slug || restaurant._id.toString(),
  );
};

exports.removeFavoriteRestaurant = async (userId, restaurantId) => {
  const restaurant = await restaurantRepository.findByIdOrSlug(restaurantId);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");
  return userRepository.removeFavoriteRestaurant(
    userId,
    restaurant.slug || restaurant._id.toString(),
  );
};
