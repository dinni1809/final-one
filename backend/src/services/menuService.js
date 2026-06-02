const menuRepository = require("../repositories/menuRepository");

exports.getRestaurantMenu = (restaurantId) => menuRepository.findByRestaurant(restaurantId);
exports.search = (q) => menuRepository.search(q);
