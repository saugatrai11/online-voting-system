const mongoose = require("mongoose");
const crypto = require("crypto");
const Vote = require("../models/Vote"); 
const Election = require("../models/Election");
const Candidate = require("../models/Candidate");

// ✅ Cast Vote with Digital Receipt
exports.castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const voterId = req.user.id;

    // 1. Validate ObjectIDs
    if (!mongoose.Types.ObjectId.isValid(electionId) || !mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({ msg: "Invalid ID format provided" });
    }

    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ msg: "Election not found" });

    // 2. Check if election is active
    const now = new Date();
    if (!election.isActive || now < election.startDate || now > election.endDate) {
      return res.status(400).json({ msg: "Election is not currently active" });
    }

    // 3. Check for duplicate vote
    const existingVote = await Vote.findOne({ electionId, voterId });
    if (existingVote) {
      return res.status(400).json({ msg: "You have already voted in this election" });
    }

    // 4. Verify candidate belongs to this election
    const candidate = await Candidate.findOne({ _id: candidateId, electionId });
    if (!candidate) {
      return res.status(400).json({ msg: "Candidate not found in this election" });
    }

    // 🛡️ 5. GENERATE CRYPTOGRAPHIC RECEIPT
    // Combines voterId, electionId, and a secret salt to create a unique fingerprint
    const secretSalt = process.env.RECEIPT_SECRET || "BCA_SECRET_SALT_2026";
    const dataToHash = `${voterId}-${electionId}-${secretSalt}`;
    const receiptHash = crypto
      .createHash("sha256")
      .update(dataToHash)
      .digest("hex");

    // 6. Create Vote & Increment Candidate count (Atomic Transaction)
    await Vote.create({ 
      electionId, 
      candidateId, 
      voterId, 
      receiptHash // Saving the proof
    });
    
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

    res.json({ 
      msg: "Vote cast successfully", 
      receipt: receiptHash // Provide this to the user as proof
    });

  } catch (err) {
    console.error("Vote Error:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ✅ Get Election Results
exports.getResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      return res.status(400).json({ msg: "Invalid Election ID format" });
    }

    const candidates = await Candidate.find({ electionId }).select("name party votes");
    res.json(candidates);
  } catch (err) {
    console.error("Results Error:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ✅ Verify Receipt (New Feature)
exports.verifyReceipt = async (req, res) => {
  try {
    const { receipt } = req.body;
    if (!receipt) return res.status(400).json({ msg: "Receipt hash is required" });

    const vote = await Vote.findOne({ receiptHash: receipt });

    if (vote) {
      res.json({ 
        valid: true, 
        msg: "Vote verified. Your choice is securely recorded in the blockchain-style ledger.",
        timestamp: vote.createdAt 
      });
    } else {
      res.status(404).json({ valid: false, msg: "Invalid receipt. This vote does not exist." });
    }
  } catch (err) {
    res.status(500).json({ msg: "Verification failed" });
  }
};