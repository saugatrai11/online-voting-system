const express = require("express");
const router = express.Router();

const { createElection, getElections, toggleElection } = require("../controllers/electionController");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Admin Only
router.post("/create", auth, admin, createElection);
router.put("/toggle/:id", auth, admin, toggleElection);

// Public
router.get("/", getElections);

module.exports = router;
