const router = require("express").Router();
const favoriteController = require("../controllers/favoriteController");
const { requireAuth } = require("../middleware/authMiddleware");

router.use(requireAuth);
router.get("/restaurants", favoriteController.getRestaurants);
router.post("/restaurants", favoriteController.addRestaurant);
router.delete(
  "/restaurants/:restaurantId",
  favoriteController.removeRestaurant,
);

module.exports = router;
