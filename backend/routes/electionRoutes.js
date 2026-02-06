const express = require("express");
const router = express.Router();
const { 
  createElection, 
  getElections, 
  getElectionById, // 👈 Add this controller function
  toggleElection 
} = require("../controllers/electionController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// ✅ Create Election
router.post("/create", auth, admin, createElection);

// ✅ Toggle Status
router.put("/toggle/:id", auth, admin, toggleElection);

// ✅ Get ALL Elections
router.get("/", auth, getElections);

// 🆕 Add this: Get SINGLE Election by ID
// This is what ManageCandidates.jsx is looking for!
router.get("/:id", auth, getElectionById);

module.exports = router;