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

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "6mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/profile", profileRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/jobs", jobsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Global error handler
app.use(errorHandler);

export default app;
