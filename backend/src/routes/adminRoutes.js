const router = require("express").Router();
const adminRestaurantController = require("../controllers/adminRestaurantController");
const adminMenuController = require("../controllers/adminMenuController");
const { requireAuth } = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const validate = require("../middleware/validationMiddleware");
const { restaurantValidator } = require("../validators/restaurantValidator");
const { menuItemValidator } = require("../validators/menuValidator");

router.use(requireAuth, requireAdmin);

router.post("/restaurants", validate(restaurantValidator), adminRestaurantController.create);
router.put("/restaurants/:id", validate(restaurantValidator), adminRestaurantController.update);
router.delete("/restaurants/:id", adminRestaurantController.remove);
router.post("/menu", validate(menuItemValidator), adminMenuController.create);
router.put("/menu/:id", validate(menuItemValidator), adminMenuController.update);
router.delete("/menu/:id", adminMenuController.remove);
router.get("/stats/restaurants", adminRestaurantController.restaurantCount);
router.get("/stats/menu", adminMenuController.menuCount);
router.get("/stats/users", adminMenuController.userCount);

module.exports = router;
