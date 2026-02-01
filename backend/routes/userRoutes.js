const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

router.get("/profile", auth, (req, res) => {
  res.json({ msg: "User profile route - implement" });
});

module.exports = router;
