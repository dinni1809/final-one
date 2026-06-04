const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const { getPagination } = require("../utils/pagination");

exports.create = (data) => Restaurant.create(data);
exports.findById = (id) => Restaurant.findById(id);
exports.findBySlug = (slug) => Restaurant.findOne({ slug });
exports.findByIdOrSlug = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const restaurant = await Restaurant.findById(id);
    if (restaurant) return restaurant;
  }
  return Restaurant.findOne({ slug: id.toString().toLowerCase() });
};
exports.findBySlugs = (values) => {
  const normalizedSlugs = values
    .filter((value) => typeof value === "string")
    .map((value) => value.toLowerCase());

  const objectIds = values
    .filter((value) => mongoose.Types.ObjectId.isValid(value.toString()))
    .map((value) => new mongoose.Types.ObjectId(value.toString()));

  return Restaurant.find({
    $or: [
      { slug: { $in: normalizedSlugs } },
      ...(objectIds.length > 0 ? [{ _id: { $in: objectIds } }] : []),
    ],
  });
};
exports.update = (id, data) =>
  Restaurant.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.updateRatingAndReviewCount = (id, rating, reviewCount) =>
  Restaurant.findByIdAndUpdate(id, { rating, reviewCount }, { new: true, runValidators: true });
exports.remove = (id) => Restaurant.findByIdAndDelete(id);
exports.count = () => Restaurant.countDocuments();
exports.distinctAreas = () => Restaurant.distinct("area");

exports.findAll = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const sort = query.sort || "-rating";
  const [items, total] = await Promise.all([
    Restaurant.find().sort(sort).skip(skip).limit(limit),
    Restaurant.countDocuments(),
  ]);

  return { items, total, page, limit };
};

exports.searchByName = (q = "") =>
  Restaurant.find({ name: { $regex: q, $options: "i" } }).sort("-rating");

exports.filter = async ({
  area,
  cuisine,
  price,
  rating,
  style,
  menuItem,
  sort,
  page,
  limit,
}) => {
  const filter = {};

  // 1. Area: Case-insensitive substring match (handles comma-separated lists)
  if (area) {
    filter.area = { $regex: area.trim(), $options: "i" };
  }

  // 2. Cuisine and Style/Type (both are checked against the 'cuisine' field in MongoDB)
  const cuisineConditions = [];
  if (cuisine) {
    cuisineConditions.push({ cuisine: { $regex: cuisine.trim(), $options: "i" } });
  }
  if (style) {
    cuisineConditions.push({ cuisine: { $regex: style.trim(), $options: "i" } });
  }
  if (cuisineConditions.length > 0) {
    filter.$and = cuisineConditions;
  }

  // 3. Price Category: Maps to lowercase price_range in DB
  if (price) {
    filter.price_range = price.trim().toLowerCase();
  }

  // 4. Rating: Maps to either rating (1-5) or faattsoo_rating (0-10) scaled correctly
  if (rating) {
    const numRating = parseFloat(rating);
    if (!isNaN(numRating)) {
      filter.$or = [
        { rating: { $gte: numRating } },
        { faattsoo_rating: { $gte: numRating * 2 } },
      ];
    }
  }

  // 5. Menu Item: Find matching restaurant_ids from MenuItem collection
  if (menuItem) {
    const menuMatches = await MenuItem.distinct("restaurant_id", {
      name: { $regex: menuItem.trim(), $options: "i" },
    });
    filter._id = { $in: menuMatches };
  }

  let sortRule = "-rating";
  if (sort === "rating") {
    sortRule = "-rating -faattsoo_rating";
  } else if (sort === "popular") {
    sortRule = "-reviewCount -rating";
  } else if (sort === "recommended") {
    sortRule = "-isFeatured -rating";
  }

  const pagination = getPagination({ page, limit });
  const [items, total] = await Promise.all([
    Restaurant.find(filter)
      .sort(sortRule)
      .skip(pagination.skip)
      .limit(pagination.limit),
    Restaurant.countDocuments(filter),
  ]);

  return { items, total, page: pagination.page, limit: pagination.limit };
};

exports.topRated = () => Restaurant.find().sort("-rating").limit(10);
exports.featured = () =>
  Restaurant.find({ isFeatured: true }).sort("-rating").limit(10);
exports.recent = () => Restaurant.find().sort("-createdAt").limit(10);
