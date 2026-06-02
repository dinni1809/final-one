const Joi = require("joi");

exports.registerValidator = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.googleValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  googleId: Joi.string().required(),
  avatar: Joi.string().uri().allow("", null),
});
