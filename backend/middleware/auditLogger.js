const AuditLog = require("../models/AuditLog");

const logAdminAction = (actionType) => async (req, res, next) => {
  // We hook into the 'finish' event of the response to ensure the action was successful
  res.on('finish', async () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        await AuditLog.create({
          adminId: req.user.id,
          action: actionType,
          targetId: req.params.id || req.body.electionId,
          details: req.body,
          ipAddress: req.ip
        });
      } catch (err) {
        console.error("Audit Log Failed:", err);
      }
    }
  });
  next();
};

module.exports = logAdminAction;