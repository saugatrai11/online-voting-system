const rateLimit = require("express-rate-limit");

const voteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 vote attempts per window
  message: { msg: "Too many attempts, please try again after 15 minutes" }
});

module.exports = { voteLimiter };