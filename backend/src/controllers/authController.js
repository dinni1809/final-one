const authService = require("../services/authService");
const response = require("../utils/responseHandler");

exports.register = async (req, res, next) => {
  try {
    response.created(res, await authService.register(req.body));
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    response.ok(res, await authService.login(req.body));
  } catch (error) {
    next(error);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    response.ok(res, await authService.googleLogin(req.body));
  } catch (error) {
    next(error);
  }
};

exports.me = (req, res) => response.ok(res, { user: req.user });

exports.updateProfile = async (req, res, next) => {
  try {
    response.ok(res, await authService.updateProfile(req.user._id, req.body));
  } catch (error) {
    next(error);
  }
};

exports.logout = (_req, res) =>
  response.ok(res, { message: "Logged out successfully" });
