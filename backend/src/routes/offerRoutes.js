const router = require("express").Router();
const offerController = require("../controllers/offerController");

router.get("/", offerController.getAll);

module.exports = router;
