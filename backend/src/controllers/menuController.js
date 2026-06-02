const menuService = require("../services/menuService");
const response = require("../utils/responseHandler");

exports.getRestaurantMenu = async (req, res, next) => {
  try {
    response.ok(res, await menuService.getRestaurantMenu(req.params.restaurantId));
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    response.ok(res, await menuService.search(req.query.q));
  } catch (error) {
    next(error);
  }
};
