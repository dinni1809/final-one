const User = require("../models/User");

exports.create = (data) => User.create(data);
exports.findByEmail = (email) => User.findOne({ email });
exports.findByEmailWithPassword = (email) => User.findOne({ email }).select("+password");
exports.findById = (id) => User.findById(id);
exports.count = () => User.countDocuments();
exports.upsertGoogleUser = ({ name, email, googleId, avatar }) =>
  User.findOneAndUpdate(
    { email },
    { name, email, googleId, avatar },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
