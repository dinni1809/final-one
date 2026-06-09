const Review = require("../models/Review");
const reviewRepository = require("../repositories/reviewRepository");
const response = require("../utils/responseHandler");

exports.getAll = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    response.ok(res, reviews);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) {
      return response.ok(res, { message: "Review not found or already deleted" });
    }
    await Review.findByIdAndDelete(reviewId);

    // Recalculate average rating & review count for the restaurant
    const summary = await reviewRepository.getSummary(review.restaurant);
    const restaurantRepository = require("../repositories/restaurantRepository");
    await restaurantRepository.updateRatingAndReviewCount(
      review.restaurant,
      summary.average,
      summary.reviewCount
    );

    response.ok(res, { message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};
