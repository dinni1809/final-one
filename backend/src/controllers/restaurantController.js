const restaurantService = require("../services/restaurantService");
const response = require("../utils/responseHandler");

exports.getAll = async (req, res, next) => {
  try {
    response.ok(res, await restaurantService.getAll(req.query));
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    response.ok(res, await restaurantService.getById(req.params.id));
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    response.ok(res, await restaurantService.search(req.query.q));
  } catch (error) {
    next(error);
  }
};

exports.filter = async (req, res, next) => {
  try {
    response.ok(res, await restaurantService.filter(req.query));
  } catch (error) {
    next(error);
  }
};

exports.areas = async (_req, res, next) => {
  try {
    response.ok(res, await restaurantService.getAreas());
  } catch (error) {
    next(error);
  }
};

exports.cuisines = (_req, res) =>
  response.ok(res, restaurantService.getCuisines());
exports.styles = (_req, res) => response.ok(res, restaurantService.getStyles());
exports.prices = (_req, res) => response.ok(res, restaurantService.getPrices());
exports.topRated = async (_req, res, next) => {
  try {
    response.ok(res, await restaurantService.topRated());
  } catch (error) {
    next(error);
  }
};
exports.featured = async (_req, res, next) => {
  try {
    response.ok(res, await restaurantService.featured());
  } catch (error) {
    next(error);
  }
};
exports.recent = async (_req, res, next) => {
  try {
    response.ok(res, await restaurantService.recent());
  } catch (error) {
    next(error);
  }
};

exports.ratings = async (req, res, next) => {
  try {
    const ratings = await require("../services/reviewService").getRatings(
      req.params.id,
    );
    response.ok(res, ratings);
  } catch (error) {
    next(error);
  }
};

exports.reviews = async (req, res, next) => {
  try {
    const reviews = await require("../services/reviewService").getReviews(
      req.params.id,
    );
    response.ok(res, reviews);
  } catch (error) {
    next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const review = await require("../services/reviewService").createReview(
      req.params.id,
      req.user,
      req.body,
    );
    response.created(res, review);
  } catch (error) {
    next(error);
  }
};
