const router = require("express").Router();
const restaurantController = require("../controllers/restaurantController");

router.get("/", restaurantController.getAll);
router.get("/search", restaurantController.search);
router.get("/filter", restaurantController.filter);
router.get("/areas", restaurantController.areas);
router.get("/cuisines", restaurantController.cuisines);
router.get("/styles", restaurantController.styles);
router.get("/prices", restaurantController.prices);
router.get("/top-rated", restaurantController.topRated);
router.get("/featured", restaurantController.featured);
router.get("/recent", restaurantController.recent);
router.get("/:id/ratings", restaurantController.ratings);
router.get("/:id/reviews", restaurantController.reviews);
router.post(
  "/:id/reviews",
  require("../middleware/authMiddleware").requireAuth,
  restaurantController.addReview,
);
router.get("/:id", restaurantController.getById);

module.exports = router;
