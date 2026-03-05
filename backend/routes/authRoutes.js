const express = require("express");
const router = express.Router();
const { validate, registerSchema } = require("../middleware/validate");
const { 
  register, 
  login, 
  getMe, 
  verifyUser, 
  forgotPassword, 
  resetPassword,
  resendOTP 
} = require("../controllers/authController");

const auth = require("../middleware/authMiddleware");
const validatePassword = require("../middleware/validatePassword");

// --- Registration & Verification ---
// 🛡️ FIXED: Combined Zod validation and Password Strength check in one route
router.post("/register", validate(registerSchema), validatePassword, register);
router.post("/verify-otp", verifyUser);
router.post("/resend-otp", resendOTP); 

// --- Authentication ---
router.post("/login", login);
router.get("/me", auth, getMe);

// --- Password Recovery ---
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;