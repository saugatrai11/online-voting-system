const express = require("express");
const router = express.Router();

const candidateController = require("../controllers/candidateController");

// ✅ Import middleware correctly
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Admin add candidate
router.post("/", authMiddleware, adminMiddleware, candidateController.addCandidate);

// Get candidates by election
router.get("/:electionId", candidateController.getCandidates);

// Admin delete candidate
router.delete("/:id", authMiddleware, adminMiddleware, candidateController.deleteCandidate);

module.exports = router;
