const router = require("express").Router();
const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  googleValidator,
} = require("../validators/authValidator");

router.post("/register", validate(registerValidator), authController.register);
router.post("/login", validate(loginValidator), authController.login);
router.post("/google", validate(googleValidator), authController.googleLogin);
router.get("/me", requireAuth, authController.me);
router.put(
  "/me",
  requireAuth,
  validate(updateProfileValidator),
  authController.updateProfile,
);
router.post("/logout", authController.logout);

// Verification routes
router.post("/send-verification", requireAuth, authController.sendVerification);
router.get("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);

module.exports = router;
