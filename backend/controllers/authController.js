const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/mail");

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

    // Generate OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
      role: userRole,
      verificationCode,
      isVerified: false
    });

    await user.save();

    // 📧 Send OTP via Ethereal
    await sendEmail(
      email,
      "Email Verification Code",
      `Hello ${name},

Your verification code is: ${verificationCode}

This code will be used to verify your account.

Online Voting System`
    );

    res.status(201).json({
      msg: "Registered successfully. Verification code sent to email."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= VERIFY USER =================
exports.verifyUser = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.verificationCode !== code) {
      return res.status(400).json({ msg: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.json({ msg: "Account verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

  if (!user.isVerified && user.role !== "admin") {
  return res.status(400).json({ msg: "Please verify your email first" });
}


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= GET CURRENT USER =================

exports.getMe = async (req, res) => {
  try {
    // req.user is populated by authMiddleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};