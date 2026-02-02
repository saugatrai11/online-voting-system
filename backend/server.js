const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const initCronJobs = require("./utils/cronJobs");

// Load Environment Variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Essential for parsing JSON bodies        
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/elections", require("./routes/electionRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/vote", require("./routes/voteRoutes"));

// Default Route for Health Check
app.get("/", (req, res) => {
  res.send("Online Voting System API is running...");
});

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    // Start the server only after DB connection is successful
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      
      // Start the Automation Engine (Cron Jobs)
      initCronJobs();
      console.log("⏰ Background Automation (Cron) started");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Stop the process if DB connection fails
  });