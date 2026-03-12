const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const logAction = require("../middleware/auditLogger");

router.post("/add", auth, admin, candidateController.addCandidate);

// Clean GET route
router.get("/election/:electionId", auth, candidateController.getCandidates);

// Clean DELETE route with audit log
router.delete("/:id", auth, admin, logAction("DELETE_CANDIDATE"), candidateController.deleteCandidate);

module.exports = router;