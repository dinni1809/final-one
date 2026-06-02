const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const { getPagination } = require("../utils/pagination");

exports.create = (data) => Restaurant.create(data);
exports.findById = (id) => Restaurant.findById(id);
exports.update = (id, data) => Restaurant.findByIdAndUpdate(id, data, { new: true, runValidators: true });
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

exports.filter = async ({ area, cuisine, price, rating, style, menuItem, page, limit }) => {
  const filter = {};
  if (area) filter.area = area;
  if (cuisine) filter.cuisine = cuisine;
  if (price) filter.priceCategory = price;
  if (rating) filter.rating = { $gte: Number(rating) };
  if (style) filter.style = style;

  if (menuItem) {
    const menuMatches = await MenuItem.distinct("restaurant", {
      name: { $regex: menuItem, $options: "i" },
    });
    filter._id = { $in: menuMatches };
  }

  const pagination = getPagination({ page, limit });
  const [items, total] = await Promise.all([
    Restaurant.find(filter).sort("-rating").skip(pagination.skip).limit(pagination.limit),
    Restaurant.countDocuments(filter),
  ]);

  return { items, total, page: pagination.page, limit: pagination.limit };
};

exports.topRated = () => Restaurant.find().sort("-rating").limit(10);
exports.featured = () => Restaurant.find({ isFeatured: true }).sort("-rating").limit(10);
exports.recent = () => Restaurant.find().sort("-createdAt").limit(10);
