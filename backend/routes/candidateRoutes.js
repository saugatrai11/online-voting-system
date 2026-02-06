const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// ✅ Matches: POST /api/candidates/add
router.post("/add", auth, admin, candidateController.addCandidate);

// ✅ Matches: DELETE /api/candidates/:id
router.delete("/:id", auth, admin, candidateController.deleteCandidate);

// ✅ Matches: GET /api/candidates/election/:electionId
// Adding "election/" prefix prevents conflict with other GET routes
router.get("/election/:electionId", auth, candidateController.getCandidates);

module.exports = router;