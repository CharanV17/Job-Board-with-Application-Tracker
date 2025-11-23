import express from "express";
import helmet from "helmet";
import cors from "cors";
import "express-async-errors";

// Routes
import applicationRoutes from "./routes/applications.routes";
import errorHandler from "./middleware/errorHandler";
import uploadRoutes from "./routes/upload.routes";
import profileRoutes from "./routes/profile.routes";
import jobsRoutes from "./routes/jobs.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

// Security
app.use(helmet());

// ⭐ FIXED CORS CONFIG
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://job-board-with-application-tracker.vercel.app", // Vercel frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "6mb" }));

// ⭐ ROUTES (clean, no duplicates)
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobsRoutes);

// ⭐ HEALTH CHECK (should be under /api)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Global error handler
app.use(errorHandler);

export default app;
