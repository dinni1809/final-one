const router = require("express").Router();
const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const { registerValidator, loginValidator, googleValidator } = require("../validators/authValidator");

router.post("/register", validate(registerValidator), authController.register);
router.post("/login", validate(loginValidator), authController.login);
router.post("/google", validate(googleValidator), authController.googleLogin);
router.get("/me", requireAuth, authController.me);
router.post("/logout", authController.logout);

module.exports = router;
