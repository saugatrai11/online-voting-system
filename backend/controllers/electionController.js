const Election = require("../models/Election");

// Create Election (Admin)
exports.createElection = async (req, res) => {
  try {
    const { title, description, startDate, endDate, type } = req.body;

    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({ msg: "Please provide title, description, and both dates." });
    }

    const election = new Election({
      title,
      description,
      type: type || "National",
      startDate: new Date(startDate), 
      endDate: new Date(endDate),     
      isActive: true                  
    });

    await election.save();
    res.status(201).json({ msg: "Election created successfully", election });
  } catch (err) {
    console.error("Error creating election:", err.message);
    res.status(500).json({ msg: "Server Error: " + err.message });
  }
};

// Get All Elections 
exports.getElections = async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    res.json(elections);
  } catch (err) {
    console.error("Error fetching elections:", err.message);
    res.status(500).json({ msg: "Server error fetching elections" });
  }
};

// ✅ ADDED: Get Single Election (Fixes the 404 error)
exports.getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ msg: "Election not found" });
    }
    res.json(election);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching election details" });
  }
};

// Activate / Close Election 
exports.toggleElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ msg: "Election not found" });
    }
    election.isActive = !election.isActive;
    await election.save();
    res.json({ msg: `Election is now ${election.isActive ? 'Active' : 'Closed'}`, election });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update election status" });
  }
};