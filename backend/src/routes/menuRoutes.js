const router = require("express").Router();
const menuController = require("../controllers/menuController");

router.get("/search", menuController.search);
router.get("/:restaurantId", menuController.getRestaurantMenu);

module.exports = router;
