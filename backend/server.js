import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import symptomRoutes from "./routes/symptomRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

console.log("MongoDB URI:", process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Removed strict JWT_SECRET check to allow seamless hackathon deployment without env setup
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "VitalearnSuperSecretKey2026";
}

configureCloudinary(process.env);

app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

app.get("/health", (req, res) => {

    res.json({

        success:true,

        mongoConnected:
            mongoose.connection.readyState===1,

        mode:
            mongoose.connection.readyState===1
                ?"Database"
                :"Demo"

    });

});

app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);
app.use("/doctors", doctorRoutes);
app.use("/parents", parentRoutes);
app.use("/admin", adminRoutes);
app.use("/reports", reportRoutes);
app.use("/symptoms", symptomRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/notifications", notificationRoutes);

// Serve static assets if in production or if running a unified build
const __dirname_resolved = path.resolve();
const frontendDistPath = path.join(__dirname_resolved, "frontend", "dist");

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  // If running as a standalone API (e.g. on Vercel)
  app.get("/", (req, res) => {
    res.json({ message: "VitaLearn Nexus API is running." });
  });
}

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`VitaLearn Nexus backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

start();
