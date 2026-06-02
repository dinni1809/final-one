const ApiError = require("../utils/ApiError");
const { ROLES } = require("../constants/roles");

module.exports = (req, _res, next) => {
  if (req.user?.role !== ROLES.ADMIN) {
    return next(new ApiError(403, "Admin access required"));
  }

  next();
};
