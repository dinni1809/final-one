const User = require("../models/User");

exports.create = (data) => User.create(data);
exports.findByEmail = (email) => User.findOne({ email });
exports.findByUsername = (username) =>
  User.findOne({ username: username.trim().toLowerCase() });
exports.findByEmailWithPassword = (email) =>
  User.findOne({ email }).select("+password");
exports.findByIdentifierWithPassword = (identifier) => {
  const normalized = identifier.trim().toLowerCase();
  return User.findOne({
    $or: [{ email: normalized }, { username: normalized }],
  }).select("+password");
};
exports.findById = (id) => User.findById(id);
exports.updateProfile = (id, data) =>
  User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
    context: "query",
  }).select("-password");
exports.count = () => User.countDocuments();
exports.upsertGoogleUser = ({ name, email, googleId, avatar }) =>
  User.findOneAndUpdate(
    { email },
    { name, email, googleId, avatar },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

exports.addFavoriteRestaurant = (userId, restaurantSlug) =>
  User.findByIdAndUpdate(
    userId,
    { $addToSet: { favoriteRestaurants: restaurantSlug } },
    { new: true, runValidators: true },
  );

exports.removeFavoriteRestaurant = (userId, restaurantSlug) =>
  User.findByIdAndUpdate(
    userId,
    { $pull: { favoriteRestaurants: restaurantSlug } },
    { new: true, runValidators: true },
  );
