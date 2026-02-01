const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  image: { type: String },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true
  },
  votes: { type: Number, default: 0 }
});

module.exports = mongoose.model("Candidate", CandidateSchema);
