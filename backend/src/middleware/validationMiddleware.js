const ApiError = require("../utils/ApiError");

module.exports = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(new ApiError(400, error.details.map((detail) => detail.message).join(", ")));
  }

  req.body = value;
  next();
};
