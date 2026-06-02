const Joi = require("joi");

exports.menuItemValidator = Joi.object({
  restaurant: Joi.string().hex().length(24).required(),
  name: Joi.string().min(2).max(120).required(),
  description: Joi.string().allow("", null),
  price: Joi.number().min(0).required(),
  category: Joi.string().allow("", null),
  image: Joi.string().allow("", null),
  isAvailable: Joi.boolean().default(true),
});
