const cron = require("node-cron");
const Election = require("../models/Election");

const initCronJobs = () => {
  // 🕒 CHANGE: Run every 5 minutes "*/5 * * * *" 
  // This reduces CPU load while still being "real-time" enough for an election.
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();

      // We combine these into a single database call or run them sequentially
      // 1. Activate elections
      const activated = await Election.updateMany(
        { 
          startDate: { $lte: now }, 
          endDate: { $gt: now }, 
          isActive: false 
        },
        { $set: { isActive: true } }
      );

      // 2. Deactivate elections
      const deactivated = await Election.updateMany(
        { 
          endDate: { $lt: now }, 
          isActive: true 
        },
        { $set: { isActive: false } }
      );

      if (activated.modifiedCount > 0 || deactivated.modifiedCount > 0) {
        console.log(`[Automation] ${new Date().toISOString()}: ${activated.modifiedCount} activated, ${deactivated.modifiedCount} closed.`);
      }
    } catch (err) {
      console.error("[Cron Error]:", err);
    }
  });
};

module.exports = initCronJobs;