const favoriteService = require("../services/favoriteService");
const response = require("../utils/responseHandler");

exports.getRestaurants = async (req, res, next) => {
  try {
    response.ok(
      res,
      await favoriteService.getFavoriteRestaurants(req.user._id),
    );
  } catch (error) {
    next(error);
  }
};

exports.addRestaurant = async (req, res, next) => {
  try {
    response.created(
      res,
      await favoriteService.addFavoriteRestaurant(
        req.user._id,
        req.body.restaurantId,
      ),
    );
  } catch (error) {
    next(error);
  }
};

exports.removeRestaurant = async (req, res, next) => {
  try {
    response.ok(
      res,
      await favoriteService.removeFavoriteRestaurant(
        req.user._id,
        req.params.restaurantId,
      ),
    );
  } catch (error) {
    next(error);
  }
};
