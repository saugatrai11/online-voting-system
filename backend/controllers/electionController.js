const Election = require("../models/Election");

// Create Election (Admin)
exports.createElection = async (req, res) => {
  try {
    const election = await Election.create(req.body);
    res.json({ msg: "Election created", election });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get All Elections
exports.getElections = async (req, res) => {
  const elections = await Election.find();
  res.json(elections);
};

// Activate / Close Election
exports.toggleElection = async (req, res) => {
  const election = await Election.findById(req.params.id);
  election.isActive = !election.isActive;
  await election.save();
  res.json({ msg: "Election status updated", election });
};
