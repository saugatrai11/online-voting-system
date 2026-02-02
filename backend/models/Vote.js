const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
  voterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiptHash: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true });

// Prevent a user from voting in the same election twice at the Database level
voteSchema.index({ electionId: 1, voterId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);