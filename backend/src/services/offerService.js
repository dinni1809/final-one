const offerRepository = require("../repositories/offerRepository");

exports.getTopOffers = () => offerRepository.findAll();
