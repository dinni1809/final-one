const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");

exports.create = (data) => MenuItem.create(data);
exports.findByRestaurant = async (restaurantId) => {
  const query = { isAvailable: true };
  if (mongoose.Types.ObjectId.isValid(restaurantId)) {
    query.restaurant = restaurantId;
  } else {
    const restaurant = await Restaurant.findOne({
      slug: restaurantId.toLowerCase(),
    });
    if (!restaurant) return [];
    query.restaurant = restaurant._id;
  }
  return MenuItem.find(query);
};
exports.search = (q = "") =>
  MenuItem.find({ name: { $regex: q, $options: "i" } }).populate(
    "restaurant",
    "name area rating image",
  );
exports.update = (id, data) =>
  MenuItem.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.remove = (id) => MenuItem.findByIdAndDelete(id);
exports.count = () => MenuItem.countDocuments();
