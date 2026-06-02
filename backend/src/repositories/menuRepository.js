const MenuItem = require("../models/MenuItem");

exports.create = (data) => MenuItem.create(data);
exports.findByRestaurant = (restaurantId) => MenuItem.find({ restaurant: restaurantId, isAvailable: true });
exports.search = (q = "") =>
  MenuItem.find({ name: { $regex: q, $options: "i" } }).populate("restaurant", "name area rating image");
exports.update = (id, data) => MenuItem.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.remove = (id) => MenuItem.findByIdAndDelete(id);
exports.count = () => MenuItem.countDocuments();
