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
  receiptHash: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true });

// Index for fast result lookups
voteSchema.index({ electionId: 1 });

module.exports = mongoose.model("Vote", voteSchema);