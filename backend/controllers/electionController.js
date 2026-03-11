const Election = require("../models/Election");

// ================= CREATE ELECTION (Admin) =================
exports.createElection = async (req, res) => {
  try {
    // 1. Destructure the extra eligibility fields (minAge, requiredDistrict) 
    // these come from your AdminDashboard frontend form.
    const { 
      title, 
      description, 
      startDate, 
      endDate, 
      type, 
      minAge, 
      requiredDistrict 
    } = req.body;

    // Validation
    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({ msg: "Please provide title, description, and both dates." });
    }

    const election = new Election({
      title,
      description,
      type: type || "National",
      startDate: new Date(startDate), 
      endDate: new Date(endDate),
      // 2. Map the new fields to the model. 
      // Defaults are set if the frontend doesn't provide them.
      minAge: minAge || 18, 
      requiredDistrict: requiredDistrict || "All",
      isActive: true                  
    });

    await election.save();
    res.status(201).json({ msg: "Election created successfully", election });
  } catch (err) {
    console.error("Error creating election:", err.message);
    res.status(500).json({ msg: "Server Error: " + err.message });
  }
};

// ================= GET ALL ELECTIONS =================
exports.getElections = async (req, res) => {
  try {
    // Sorting by newest first
    const elections = await Election.find().sort({ createdAt: -1 });
    res.json(elections);
  } catch (err) {
    console.error("Error fetching elections:", err.message);
    res.status(500).json({ msg: "Server error fetching elections" });
  }
};

// ================= GET SINGLE ELECTION BY ID =================
// ✅ Fixes the 404 error when navigating to Ballot or Manage Candidates
exports.getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ msg: "Election not found" });
    }
    res.json(election);
  } catch (err) {
    console.error("Error fetching single election:", err.message);
    res.status(500).json({ msg: "Error fetching election details" });
  }
};

// ================= ACTIVATE / CLOSE ELECTION =================
exports.toggleElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ msg: "Election not found" });
    }
    
    // Switch the boolean status
    election.isActive = !election.isActive;
    await election.save();
    
    res.json({ 
      msg: `Election is now ${election.isActive ? 'Active' : 'Closed'}`, 
      election 
    });
  } catch (err) {
    console.error("Error toggling election:", err.message);
    res.status(500).json({ msg: "Failed to update election status" });
  }
};