const Joi = require("joi");
const { CUISINES } = require("../constants/cuisines");
const { PRICE_CATEGORIES } = require("../constants/priceCategories");
const { RESTAURANT_STYLES } = require("../constants/restaurantStyles");

exports.restaurantValidator = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  area: Joi.string().min(2).max(80).required(),
  cuisine: Joi.array().items(Joi.string().valid(...CUISINES)).min(1).required(),
  priceCategory: Joi.string().valid(...PRICE_CATEGORIES).required(),
  rating: Joi.number().min(0).max(10).default(0),
  style: Joi.string().valid(...RESTAURANT_STYLES).required(),
  description: Joi.string().allow("", null),
  image: Joi.string().allow("", null),
  isFeatured: Joi.boolean().default(false),
});
