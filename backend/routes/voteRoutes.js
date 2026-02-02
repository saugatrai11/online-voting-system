const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");
const authMiddleware = require("../middleware/authMiddleware");
const { voteLimiter } = require("../middleware/rateLimiter");


// POST: /api/vote/
router.post("/", authMiddleware, voteController.castVote);

// GET: /api/vote/results/:electionId
router.get("/results/:electionId", voteController.getResults);

router.post("/", authMiddleware, voteLimiter, voteController.castVote);

// This can be a public route - anyone with a receipt can check its validity
router.post("/verify-receipt", voteController.verifyReceipt);

module.exports = router;