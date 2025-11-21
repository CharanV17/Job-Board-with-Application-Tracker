import express from "express";
import helmet from "helmet";
import cors from "cors";
import "express-async-errors";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/jobs.routes";
import applicationRoutes from "./routes/applications.routes";
import errorHandler from "./middleware/errorHandler";
import uploadRoutes from "./routes/upload.routes";


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "6mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/uploads", uploadRoutes);

// health
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


app.use(errorHandler);

export default app;
