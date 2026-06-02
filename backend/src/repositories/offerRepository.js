const Offer = require("../models/Offer");

exports.findAll = () => Offer.find().sort({ createdAt: -1 });
exports.create = (data) => Offer.create(data);
exports.findById = (id) => Offer.findById(id);
exports.update = (id, data) =>
  Offer.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.remove = (id) => Offer.findByIdAndDelete(id);
