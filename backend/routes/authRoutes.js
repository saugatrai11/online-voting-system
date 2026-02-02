const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  verifyUser, 
  forgotPassword, 
  resetPassword 
} = require("../controllers/authController");

const auth = require("../middleware/authMiddleware");
const validatePassword = require("../middleware/validatePassword");

// --- Registration & Verification ---
// We combine the validation and the register function here
router.post("/register", validatePassword, register);
router.post("/verify-otp", verifyUser); // Changed to match your frontend API call

// --- Authentication ---
router.post("/login", login);
router.get("/me", auth, getMe);

// --- Password Recovery (NEW) ---
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;