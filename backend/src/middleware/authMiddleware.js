const jwt = require("jsonwebtoken");
const env = require("../config/env");
const userRepository = require("../repositories/userRepository");
const ApiError = require("../utils/ApiError");

exports.requireAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new ApiError(401, "Authentication required");

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await userRepository.findById(payload.id);
    if (!user) throw new ApiError(401, "Invalid authentication token");

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
