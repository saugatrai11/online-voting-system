const cron = require("node-cron");
const Election = require("../models/Election");

const initCronJobs = () => {
  // This cron expression "* * * * *" means "Run every single minute"
  // For a real app, you might run it once at midnight "0 0 * * *"
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // 1. Automatically ACTIVATE elections that have reached their startDate
      const activated = await Election.updateMany(
        { 
          startDate: { $lte: now }, 
          endDate: { $gt: now }, 
          isActive: false 
        },
        { $set: { isActive: true } }
      );

      // 2. Automatically DEACTIVATE elections that have passed their endDate
      const deactivated = await Election.updateMany(
        { 
          endDate: { $lt: now }, 
          isActive: true 
        },
        { $set: { isActive: false } }
      );

      if (activated.modifiedCount > 0 || deactivated.modifiedCount > 0) {
        console.log(`[Automation] ${activated.modifiedCount} started, ${deactivated.modifiedCount} ended.`);
      }
    } catch (err) {
      console.error("[Cron Error]:", err);
    }
  });
};

module.exports = initCronJobs;