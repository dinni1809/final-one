const mongoose = require("mongoose");
const { CUISINES } = require("../constants/cuisines");
const { PRICE_CATEGORIES } = require("../constants/priceCategories");
const { RESTAURANT_STYLES } = require("../constants/restaurantStyles");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    area: { type: String, required: true, trim: true, index: true },
    cuisine: [{ type: String, enum: CUISINES, index: true }],
    priceCategory: { type: String, enum: PRICE_CATEGORIES, required: true },
    rating: { type: Number, min: 0, max: 10, default: 0, index: true },
    reviewCount: { type: Number, default: 0, index: true },
    style: { type: String, enum: RESTAURANT_STYLES, required: true },
    description: { type: String, trim: true },
    image: { type: String },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

restaurantSchema.pre("save", function setSlug(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

restaurantSchema.index({ name: "text", area: "text", cuisine: "text" });

module.exports = mongoose.model("Restaurant", restaurantSchema);
