const reviewRepository = require("../repositories/reviewRepository");
const restaurantRepository = require("../repositories/restaurantRepository");

const resolveRestaurant = async (restaurantId) => {
  const restaurant = await restaurantRepository.findByIdOrSlug(restaurantId);
  if (!restaurant) throw new Error("Restaurant not found");
  return restaurant;
};

exports.getRatings = async (restaurantId) => {
  const restaurant = await resolveRestaurant(restaurantId);
  return reviewRepository.getSummary(restaurant._id);
};

exports.getReviews = async (restaurantId) => {
  const restaurant = await resolveRestaurant(restaurantId);
  return reviewRepository.findByRestaurant(restaurant._id);
};

exports.createReview = async (restaurantId, user, data) => {
  const restaurant = await resolveRestaurant(restaurantId);
  return reviewRepository.create({
    restaurant: restaurant._id,
    user: user._id,
    userName: user.name,
    rating: data.rating,
    title: data.title,
    body: data.body,
  });
};
