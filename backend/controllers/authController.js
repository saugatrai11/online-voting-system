const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/mail");

// Helper to set OTP expiry (e.g., 15 minutes from now)
const getOTPExpiry = () => new Date(Date.now() + 15 * 60 * 1000);

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, username, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "voter";

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
      role: userRole,
      verificationCode,
      otpExpire: getOTPExpiry(), // Added expiry
      isVerified: false
    });

    await user.save();

    await sendEmail(
      email,
      "Email Verification Code",
      `Hello ${name},\n\nYour verification code is: ${verificationCode}. It will expire in 15 minutes.\n\nOnline Voting System`
    );

    res.status(201).json({ msg: "Registered successfully. Verification code sent to email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during registration" });
  }
};

// ================= VERIFY USER =================
exports.verifyUser = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // 🛡️ SECURITY CHECK: Check if OTP is expired
    if (user.otpExpire && new Date() > user.otpExpire) {
      return res.status(400).json({ msg: "OTP has expired. Please request a new one." });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ msg: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.otpExpire = null; // Clear expiry after use
    await user.save();

    res.json({ msg: "Account verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during verification" });
  }
};

// ================= RESEND OTP =================
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = newOTP;
    user.otpExpire = getOTPExpiry(); // 🛡️ Reset expiry timer
    await user.save();

    await sendEmail(
      email,
      "New Verification Code",
      `Hello ${user.name},\n\nYour new verification code is: ${newOTP}. Valid for 15 minutes.\n\nOnline Voting System`
    );

    res.json({ msg: "New OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error resending OTP" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Please provide email and password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!user.isVerified && user.role !== "admin") {
      return res.status(400).json({ msg: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      msg: "Login successful",
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during login" });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = otp;
    user.otpExpire = getOTPExpiry(); // 🛡️ Set expiry for reset code
    await user.save();

    await sendEmail(
      email,
      "Password Reset Code",
      `Your OTP for password reset is: ${otp}\nValid for 15 minutes.\n\nIf you did not request this, please ignore this email.`
    );

    res.json({ msg: "Reset OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error in forgot password" });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    // 🛡️ SECURITY CHECK: Check if Reset OTP is expired
    if (user.otpExpire && new Date() > user.otpExpire) {
        return res.status(400).json({ msg: "Reset code expired. Please request a new one." });
    }

    if (user.verificationCode !== otp) {
      return res.status(400).json({ msg: "Invalid OTP. Please try again or resend code." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.verificationCode = null; 
    user.otpExpire = null; // Clear expiry
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error resetting password" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error fetching user data" });
  }
};