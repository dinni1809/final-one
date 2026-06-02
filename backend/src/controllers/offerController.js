const offerService = require("../services/offerService");
const response = require("../utils/responseHandler");

exports.getAll = async (_req, res, next) => {
  try {
    response.ok(res, await offerService.getTopOffers());
  } catch (error) {
    next(error);
  }
};
