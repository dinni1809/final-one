const restaurantRepository = require("../repositories/restaurantRepository");
const menuRepository = require("../repositories/menuRepository");
const ApiError = require("../utils/ApiError");
const { CUISINES } = require("../constants/cuisines");
const { PRICE_CATEGORIES } = require("../constants/priceCategories");
const { RESTAURANT_STYLES } = require("../constants/restaurantStyles");

exports.getAll = (query) => restaurantRepository.findAll(query);

exports.getById = async (id) => {
  const restaurant = await restaurantRepository.findByIdOrSlug(id);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");
  const menu = await menuRepository.findByRestaurant(restaurant._id);
  return { restaurant, menu };
};

exports.search = (q) => restaurantRepository.searchByName(q);
exports.filter = (query) => restaurantRepository.filter(query);
exports.getAreas = () => restaurantRepository.distinctAreas();
exports.getCuisines = () => CUISINES;
exports.getStyles = () => RESTAURANT_STYLES;
exports.getPrices = () => PRICE_CATEGORIES;
exports.topRated = () => restaurantRepository.topRated();
exports.featured = () => restaurantRepository.featured();
exports.recent = () => restaurantRepository.recent();
