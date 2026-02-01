const mongoose = require("mongoose");
const Vote = require("../models/Vote"); // Case-sensitive check
const Election = require("../models/Election");
const Candidate = require("../models/Candidate");

// Cast Vote
exports.castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const voterId = req.user.id;

    // Validate ObjectIDs
    if (!mongoose.Types.ObjectId.isValid(electionId) || !mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({ msg: "Invalid ID format provided" });
    }

    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ msg: "Election not found" });

    // Check if election is active
    const now = new Date();
    if (!election.isActive || now < election.startDate || now > election.endDate) {
      return res.status(400).json({ msg: "Election is not currently active" });
    }

    // Check for duplicate vote
    const existingVote = await Vote.findOne({ electionId, voterId });
    if (existingVote) {
      return res.status(400).json({ msg: "You have already voted in this election" });
    }

    // Verify candidate
    const candidate = await Candidate.findOne({ _id: candidateId, electionId });
    if (!candidate) {
      return res.status(400).json({ msg: "Candidate not found in this election" });
    }

    // Create Vote & Increment Candidate count
    await Vote.create({ electionId, candidateId, voterId });
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

    res.json({ msg: "Vote cast successfully" });
  } catch (err) {
    console.error("Vote Error:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get Election Results
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