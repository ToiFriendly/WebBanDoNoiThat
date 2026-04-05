const express = require("express");
const {
  login,
  register,
  getMe,
  updateMe,
  getAdminAccess,
  requestGoogleOtp,
  verifyGoogleOtp
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
router.get("/me", authenticateToken, getMe);
router.put("/me", authenticateToken, updateMe);
router.get("/admin", authenticateToken, authorizeRoles("admin"), getAdminAccess);

module.exports = router;
