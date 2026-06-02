const adminService = require("../services/adminService");
const response = require("../utils/responseHandler");

exports.create = async (req, res, next) => {
  try {
    response.created(res, await adminService.createRestaurant(req.body));
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    response.ok(res, await adminService.updateRestaurant(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    response.ok(res, await adminService.deleteRestaurant(req.params.id));
  } catch (error) {
    next(error);
  }
};

exports.restaurantCount = async (_req, res, next) => {
  try {
    response.ok(res, await adminService.restaurantCount());
  } catch (error) {
    next(error);
  }
};
