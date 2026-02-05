const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Admin Routes
router.post("/", auth, admin, candidateController.addCandidate);
router.delete("/:id", auth, admin, candidateController.deleteCandidate);

// Voter/Public Routes
router.get("/:electionId", auth, candidateController.getCandidates);

module.exports = router;