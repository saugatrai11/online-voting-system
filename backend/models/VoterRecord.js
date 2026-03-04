const mongoose = require("mongoose");

const voterRecordSchema = new mongoose.Schema({
  voterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true,
  },
}, { timestamps: true });

// Strict index to prevent double voting at DB level
voterRecordSchema.index({ voterId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.model("VoterRecord", voterRecordSchema);