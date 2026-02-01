const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/dashboard", auth, admin, (req, res) => {
  res.json({ msg: "Admin dashboard - implement" });
});

module.exports = router;
