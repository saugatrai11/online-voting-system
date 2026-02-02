const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin","voter"], default: "voter" },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  otpExpire: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
