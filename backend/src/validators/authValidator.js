const Joi = require("joi");

exports.registerValidator = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .min(3)
    .max(20)
    .required()
    .messages({
      "string.pattern.base":
        "Username can only contain letters, numbers, and underscores",
    }),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.loginValidator = Joi.object({
  identifier: Joi.string().min(2),
  email: Joi.string().email(),
  password: Joi.string().required(),
})
  .or("identifier", "email")
  .messages({
    "object.missing": "Identifier or email is required",
  });

exports.updateProfileValidator = Joi.object({
  name: Joi.string().min(2).max(80),
  email: Joi.string().email(),
  avatar: Joi.string().uri().allow("", null),
}).or("name", "email", "avatar");

exports.googleValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  googleId: Joi.string().required(),
  avatar: Joi.string().uri().allow("", null),
});
