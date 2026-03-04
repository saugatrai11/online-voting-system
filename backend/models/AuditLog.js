const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true }, // e.g., "DELETE_CANDIDATE", "UPDATE_ELECTION"
  targetId: { type: mongoose.Schema.Types.ObjectId }, // ID of the candidate/election changed
  details: { type: Object }, // Store the old vs new values
  ipAddress: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", auditLogSchema);