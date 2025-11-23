import express from "express";
import helmet from "helmet";
import cors from "cors";
import "express-async-errors";

import applicationRoutes from "./routes/applications.routes";
import errorHandler from "./middleware/errorHandler";
import uploadRoutes from "./routes/upload.routes";
import profileRoutes from "./routes/profile.routes";
import jobsRoutes from "./routes/jobs.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

// ❗ FIX: Helmet must NOT block CORS headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
  })
);

// ⭐ FIXED CORS CONFIG — must match EXACT Vercel URL
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://job-board-with-application-tracker.vercel.app",
      "https://job-board-with-application-tracker-p1x4sefng.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "6mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handler
app.use(errorHandler);

export default app;
