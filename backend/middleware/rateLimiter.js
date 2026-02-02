const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { msg: "Too many requests from this IP, please try again after 15 minutes" }
});

const authLimiter = rateLimit({
  windowMs: 60*60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth attempts per window
  message: { msg: "Too many login attempts. Account locked for 1 hour for security."}
});

const voteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 vote attempts per window
  message: { msg: "Too many attempts, please try again after 15 minutes" }
});

module.exports = { voteLimiter, generalLimiter, authLimiter };