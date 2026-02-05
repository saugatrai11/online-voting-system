const Candidate = require("../models/Candidate");

// Add Candidate (Admin)
exports.addCandidate = async (req, res) => {
  try {
    const { name, party, electionId, image } = req.body;

    if (!name || !party || !electionId) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const candidate = new Candidate({ 
      name, 
      party, 
      electionId, 
      image: image || "",
      votes: 0 
    });
    await candidate.save();

    res.status(201).json({ msg: "Candidate added successfully", candidate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error adding candidate" });
  }
};

// Get Candidates by Election
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ electionId: req.params.electionId });
    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error fetching candidates" });
  }
};

// Delete Candidate (Admin)
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ msg: "Candidate not found" });
    }
    res.json({ msg: "Candidate deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error deleting candidate" });
  }
};