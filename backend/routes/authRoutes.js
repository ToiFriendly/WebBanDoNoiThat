const express = require("express");
const {
  login,
  register,
  getMe,
  getAdminAccess,
  requestGoogleOtp,
  verifyGoogleOtp,
  requestForgotPasswordOtp,
  resetForgotPassword
} = require("../controllers/authController");
const {
  authenticateToken,
  authorizeRoles
} = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google/request-otp", requestGoogleOtp);
router.post("/google/verify-otp", verifyGoogleOtp);
router.post("/forgot-password/request", requestForgotPasswordOtp);
router.post("/forgot-password/reset", resetForgotPassword);
router.get("/me", authenticateToken, getMe);
router.get("/admin", authenticateToken, authorizeRoles("admin"), getAdminAccess);

module.exports = router;
