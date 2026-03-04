const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { Parser } = require("json2csv"); // Ensure you ran 'npm install json2csv'
const Vote = require("../models/Vote");
const VoterRecord = require("../models/VoterRecord");
const Election = require("../models/Election");
const Candidate = require("../models/Candidate");

// ✅ Cast Anonymous Vote with Eligibility Checks & ACID Transactions
exports.castVote = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { electionId, candidateId } = req.body;
    const user = req.user; 

    if (!mongoose.Types.ObjectId.isValid(electionId) || !mongoose.Types.ObjectId.isValid(candidateId)) {
      throw new Error("INVALID_ID");
    }

    // 1. Fetch Election
    const election = await Election.findById(electionId).session(session);
    if (!election) throw new Error("ELECTION_NOT_FOUND");

    // 2. Timing Check
    const now = new Date();
    if (!election.isActive || now < election.startDate || now > election.endDate) {
      throw new Error("ELECTION_INACTIVE");
    }

    // 3. 🛡️ Eligibility: Age Check (Based on dob in User model)
    const birthDate = new Date(user.dob);
    let age = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < election.minAge) throw new Error("UNDERAGE");

    // 4. 🛡️ Eligibility: District Check
    if (election.requiredDistrict !== "All" && user.district !== election.requiredDistrict) {
      throw new Error("INVALID_DISTRICT");
    }

    // 5. Duplicate Check
    const existingRecord = await VoterRecord.findOne({ electionId, voterId: user.id }).session(session);
    if (existingRecord) throw new Error("ALREADY_VOTED");

    // 6. Candidate Verification
    const candidate = await Candidate.findOne({ _id: candidateId, electionId }).session(session);
    if (!candidate) throw new Error("CANDIDATE_NOT_MATCH");

    // 7. Data Updates (Atomicity)
    const anonymousReceipt = uuidv4();
    await VoterRecord.create([{ electionId, voterId: user.id }], { session });
    await Vote.create([{ electionId, candidateId, receiptHash: anonymousReceipt }], { session });
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } }, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ msg: "Vote cast successfully!", receipt: anonymousReceipt });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    const errorMap = {
      "INVALID_ID": { status: 400, msg: "Invalid ID format." },
      "ELECTION_NOT_FOUND": { status: 404, msg: "Election not found." },
      "ELECTION_INACTIVE": { status: 400, msg: "Election is closed or not started." },
      "ALREADY_VOTED": { status: 400, msg: "You have already voted." },
      "CANDIDATE_NOT_MATCH": { status: 400, msg: "Candidate not found in this election." },
      "UNDERAGE": { status: 403, msg: "You do not meet the age requirement." },
      "INVALID_DISTRICT": { status: 403, msg: "You are not registered in the required district." }
    };

    const mappedError = errorMap[err.message] || { status: 500, msg: "Server error during voting." };
    res.status(mappedError.status).json({ msg: mappedError.msg });
  }
};

// ================= RESULTS & EXPORT =================

exports.getResults = async (req, res) => {
  try {
    const { electionId } = req.params;
    const candidates = await Candidate.find({ electionId }).select("name party votes");
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ msg: "Results fetch failed." });
  }
};

exports.exportResults = async (req, res) => {
  try {
    const { electionId } = req.params;
    const election = await Election.findById(electionId);
    const candidates = await Candidate.find({ electionId });

    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

    const data = candidates.map(c => ({
      Candidate: c.name,
      Party: c.party,
      Votes: c.votes,
      Percentage: totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(2) + "%" : "0%"
    }));

    const parser = new Parser({ fields: ["Candidate", "Party", "Votes", "Percentage"] });
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment(`${election.title}_Results.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ msg: "Export failed." });
  }
};

exports.verifyReceipt = async (req, res) => {
  try {
    const { receipt } = req.body;
    const vote = await Vote.findOne({ receiptHash: receipt });
    if (vote) {
      res.json({ valid: true, timestamp: vote.createdAt });
    } else {
      res.status(404).json({ valid: false, msg: "Receipt not found." });
    }
  } catch (err) {
    res.status(500).json({ msg: "Verification failed." });
  }
};