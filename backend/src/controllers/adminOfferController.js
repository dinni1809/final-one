const offerRepository = require("../repositories/offerRepository");
const response = require("../utils/responseHandler");

exports.getAll = async (req, res, next) => {
  try {
    response.ok(res, await offerRepository.findAll());
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    response.created(res, await offerRepository.create(req.body));
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    response.ok(res, await offerRepository.update(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await offerRepository.remove(req.params.id);
    response.ok(res, { message: "Offer deleted successfully" });
  } catch (error) {
    next(error);
  }
};
