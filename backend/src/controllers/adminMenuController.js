const adminService = require("../services/adminService");
const response = require("../utils/responseHandler");

exports.create = async (req, res, next) => {
  try {
    response.created(res, await adminService.createMenuItem(req.body));
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    response.ok(res, await adminService.updateMenuItem(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    response.ok(res, await adminService.deleteMenuItem(req.params.id));
  } catch (error) {
    next(error);
  }
};

exports.menuCount = async (_req, res, next) => {
  try {
    response.ok(res, await adminService.menuCount());
  } catch (error) {
    next(error);
  }
};

exports.userCount = async (_req, res, next) => {
  try {
    response.ok(res, await adminService.userCount());
  } catch (error) {
    next(error);
  }
};
