const userRepository = require("../repositories/userRepository");
const restaurantRepository = require("../repositories/restaurantRepository");
const menuRepository = require("../repositories/menuRepository");

exports.createRestaurant = (data) => restaurantRepository.create(data);
exports.updateRestaurant = (id, data) => restaurantRepository.update(id, data);
exports.deleteRestaurant = (id) => restaurantRepository.remove(id);
exports.createMenuItem = (data) => menuRepository.create(data);
exports.updateMenuItem = (id, data) => menuRepository.update(id, data);
exports.deleteMenuItem = (id) => menuRepository.remove(id);
exports.restaurantCount = async () => ({ totalRestaurants: await restaurantRepository.count() });
exports.menuCount = async () => ({ totalMenuItems: await menuRepository.count() });
exports.userCount = async () => ({ totalUsers: await userRepository.count() });
