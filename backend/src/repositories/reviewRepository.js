const mongoose = require("mongoose");
const Review = require("../models/Review");

exports.create = (data) => Review.create(data);

exports.findByRestaurant = (restaurantId, sortBy) => {
  let sortRule = { createdAt: -1 }; // default: newest
  if (sortBy === "highest") {
    sortRule = { rating: -1, createdAt: -1 };
  } else if (sortBy === "newest") {
    sortRule = { createdAt: -1 };
  }
  return Review.find({ restaurant: restaurantId }).sort(sortRule);
};

exports.hasUserReviewed = async (restaurantId, userId) => {
  const count = await Review.countDocuments({
    restaurant: restaurantId,
    user: userId,
  });
  return count > 0;
};

exports.countByUser = (userId) => Review.countDocuments({ user: userId });

exports.getSummary = async (restaurantId) => {
  const match = { restaurant: new mongoose.Types.ObjectId(restaurantId) };
  const overall = await Review.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        average: { $avg: "$rating" },
        total: { $sum: 1 },
      },
    },
  ]);

  const breakdown = await Review.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  return {
    average: overall[0]?.average ?? 0,
    reviewCount: overall[0]?.total ?? 0,
    breakdown: breakdown.map((item) => ({
      stars: item._id,
      percent: overall[0]?.total
        ? Math.round((item.count / overall[0].total) * 100)
        : 0,
    })),
  };
};
