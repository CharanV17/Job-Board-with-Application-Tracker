import express from "express";
import cors from "cors";
import helmet from "helmet";

// Import your routes
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import applicationRoutes from "./routes/application.routes";

const app = express();

// SECURITY HEADERS
app.use(helmet());

// FIXED CORS CONFIG
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development
      "https://job-board-with-application-tracker.vercel.app", // Vercel frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API ROUTES WITH PREFIX /api
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend running fine 🚀", time: new Date() });
});

export default app;
