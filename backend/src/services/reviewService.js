const reviewRepository = require("../repositories/reviewRepository");
const restaurantRepository = require("../repositories/restaurantRepository");
const ApiError = require("../utils/ApiError");

const resolveRestaurant = async (restaurantId) => {
  const restaurant = await restaurantRepository.findByIdOrSlug(restaurantId);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");
  return restaurant;
};

exports.getRatings = async (restaurantId) => {
  const restaurant = await resolveRestaurant(restaurantId);
  return reviewRepository.getSummary(restaurant._id);
};

exports.getReviews = async (restaurantId, sortBy) => {
  const restaurant = await resolveRestaurant(restaurantId);
  return reviewRepository.findByRestaurant(restaurant._id, sortBy);
};

exports.getUserReviewsCount = async (userId) => {
  return reviewRepository.countByUser(userId);
};

exports.createReview = async (restaurantId, user, data) => {
  // 1. Resolve restaurant
  const restaurant = await resolveRestaurant(restaurantId);

  // 2. Verified users only
  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in to review or submit reviews.");
  }

  // 3. Rating validation (required, 1-5)
  const rating = Number(data.rating);
  if (!data.rating || isNaN(rating) || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating is required and must be between 1 and 5");
  }

  // 4. Review text validation (required, 10-500 chars)
  const reviewText = data.review || data.body;
  if (!reviewText || typeof reviewText !== "string") {
    throw new ApiError(400, "Review text is required");
  }
  const trimmedReview = reviewText.trim();
  if (trimmedReview.length < 10 || trimmedReview.length > 500) {
    throw new ApiError(400, "Review must be between 10 and 500 characters");
  }

  // 5. One review per user per restaurant
  const alreadyReviewed = await reviewRepository.hasUserReviewed(restaurant._id, user._id);
  if (alreadyReviewed) {
    throw new ApiError(400, "You have already reviewed this restaurant");
  }

  // 6. Create the review
  const review = await reviewRepository.create({
    restaurant: restaurant._id,
    user: user._id,
    userName: user.name,
    rating,
    title: data.title,
    review: trimmedReview,
  });

  // 7. Recalculate average rating & review count for the restaurant
  const summary = await reviewRepository.getSummary(restaurant._id);
  await restaurantRepository.updateRatingAndReviewCount(
    restaurant._id,
    summary.average,
    summary.reviewCount
  );

  return review;
};
