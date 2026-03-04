const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware"); // Assuming you have this
const { voteLimiter } = require("../middleware/rateLimiter");

// 1. Voting (Protected & Rate Limited)
router.post("/cast", authMiddleware, voteLimiter, voteController.castVote);

// 2. Verification (Public)
router.post("/verify-receipt", voteController.verifyReceipt);

// 3. Results (Public or Protected)
router.get("/results/:electionId", voteController.getResults);

// 4. Export (Admin Only)
router.get("/export/:electionId", authMiddleware, adminMiddleware, voteController.exportResults);

module.exports = router;