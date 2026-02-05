const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const initCronJobs = require("./utils/cronJobs");

dotenv.config();

const app = express();

// --- 🛡️ PRO TWEAK: STRICT CORS POLICY ---
const allowedOrigins = [
  "http://localhost:3000", // Standard React/Vite dev port
  "http://localhost:5173", // Standard Vite dev port
  process.env.FRONTEND_URL  // Your future production URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) 
    // but restrict web browsers to allowedOrigins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS Policy - Security Blocked"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/elections", require("./routes/electionRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/vote", require("./routes/voteRoutes"));

app.get("/", (req, res) => {
  res.send("Online Voting System API is running securely...");
});

const PORT = process.env.PORT || 5000;


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      initCronJobs();
      console.log("⏰ Background Automation (Cron) started");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });