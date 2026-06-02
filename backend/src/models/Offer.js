const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    restaurantId: { type: String, required: true, trim: true, index: true },
    restaurantName: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    badge: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    validUntil: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Offer", offerSchema);
