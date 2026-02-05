const express = require("express");
const router = express.Router();
const { createElection, getElections, toggleElection } = require("../controllers/electionController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// ✅ Correct Order: auth first, then admin
router.post("/create", auth, admin, createElection);
router.put("/toggle/:id", auth, admin, toggleElection);
router.get("/", auth, getElections);

module.exports = router;