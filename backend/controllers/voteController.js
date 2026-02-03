const mongoose = require("mongoose");
const crypto = require("crypto");
const Vote = require("../models/Vote");
const Election = require("../models/Election");
const Candidate = require("../models/Candidate");

// ✅ Cast Vote with Digital Receipt & ACID Transactions
exports.castVote = async (req, res) => {
  // --- 🛡️ PRO TWEAK: START SESSION FOR ATOMICITY ---
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { electionId, candidateId } = req.body;
    const voterId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(electionId) || !mongoose.Types.ObjectId.isValid(candidateId)) {
      throw new Error("INVALID_ID");
    }

    const election = await Election.findById(electionId).session(session);
    if (!election) throw new Error("ELECTION_NOT_FOUND");

    // Check if election is active
    const now = new Date();
    if (!election.isActive || now < election.startDate || now > election.endDate) {
      throw new Error("ELECTION_INACTIVE");
    }

    // Check for duplicate vote (Safe within transaction)
    const existingVote = await Vote.findOne({ electionId, voterId }).session(session);
    if (existingVote) throw new Error("ALREADY_VOTED");

    // Verify candidate belongs to this election
    const candidate = await Candidate.findOne({ _id: candidateId, electionId }).session(session);
    if (!candidate) throw new Error("CANDIDATE_NOT_MATCH");

    // GENERATE RECEIPT
    const secretSalt = process.env.RECEIPT_SECRET || "BCA_SECRET_SALT_2026";
    const dataToHash = `${voterId}-${electionId}-${secretSalt}`;
    const receiptHash = crypto.createHash("sha256").update(dataToHash).digest("hex");

    // CREATE VOTE RECORD
    await Vote.create([{ 
      electionId, 
      candidateId, 
      voterId, 
      receiptHash 
    }], { session });

    // INCREMENT CANDIDATE COUNT
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } }, { session });

    // --- 🛡️ COMMIT TRANSACTION: Everything happens together ---
    await session.commitTransaction();
    session.endSession();

    res.json({ 
      msg: "Vote cast successfully", 
      receipt: receiptHash 
    });

  } catch (err) {
    // --- 🛡️ ABORT TRANSACTION: If any error happens, no data is changed ---
    await session.abortTransaction();
    session.endSession();

    const errorMap = {
      "INVALID_ID": { status: 400, msg: "Invalid ID format provided" },
      "ELECTION_NOT_FOUND": { status: 404, msg: "Election not found" },
      "ELECTION_INACTIVE": { status: 400, msg: "Election is not currently active" },
      "ALREADY_VOTED": { status: 400, msg: "You have already voted in this election" },
      "CANDIDATE_NOT_MATCH": { status: 400, msg: "Candidate not found in this election" }
    };

    const mappedError = errorMap[err.message] || { status: 500, msg: "Internal Server Error" };
    res.status(mappedError.status).json({ msg: mappedError.msg });
  }
};

// Results and VerifyReceipt functions remain largely the same but are now safer
exports.getResults = async (req, res) => {
  try {
    const { electionId } = req.params;
    const candidates = await Candidate.find({ electionId }).select("name party votes");
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ msg: "Results Error" });
  }
};

exports.verifyReceipt = async (req, res) => {
  try {
    const { receipt } = req.body;
    const vote = await Vote.findOne({ receiptHash: receipt });
    if (vote) {
      res.json({ valid: true, msg: "Vote verified in secure ledger.", timestamp: vote.createdAt });
    } else {
      res.status(404).json({ valid: false, msg: "Invalid receipt." });
    }
  } catch (err) {
    res.status(500).json({ msg: "Verification failed" });
  }
};