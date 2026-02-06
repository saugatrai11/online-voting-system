const Candidate = require("../models/Candidate");

// ✅ Add Candidate (Admin Only)
exports.addCandidate = async (req, res) => {
  try {
    const { name, party, electionId, image } = req.body;

    // 1. Validation
    if (!name || !party || !electionId) {
      return res.status(400).json({ msg: "Name, Party, and Election ID are required" });
    }

    // 2. Creation
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
    console.error("Add Candidate Error:", err.message);
    res.status(500).json({ msg: "Server error adding candidate" });
  }
};

// ✅ Get Candidates by Election ID
exports.getCandidates = async (req, res) => {
  try {
    // Looks for candidates where electionId matches the URL parameter
    const candidates = await Candidate.find({ electionId: req.params.electionId })
                                     .sort({ name: 1 }); // Sort alphabetically
    res.json(candidates);
  } catch (err) {
    console.error("Fetch Candidates Error:", err.message);
    res.status(500).json({ msg: "Server error fetching candidates" });
  }
};

// ✅ Delete Candidate (Admin Only)
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ msg: "Candidate not found" });
    }
    
    res.json({ msg: "Candidate deleted successfully" });
  } catch (err) {
    console.error("Delete Candidate Error:", err.message);
    res.status(500).json({ msg: "Server error deleting candidate" });
  }
};