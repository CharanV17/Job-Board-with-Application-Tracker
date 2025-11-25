import express from "express";
import helmet from "helmet";
import cors from "cors";
import "express-async-errors";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/jobs.routes";
import applicationRoutes from "./routes/applications.routes";
import errorHandler from "./middleware/errorHandler";
import uploadRoutes from "./routes/upload.routes";
import profileRoutes from "./routes/profile.routes";


const app = express();

// 1. Define allowed origins (Crucial for fixing CORS error)
const allowedOrigins = [
    'http://localhost:5173', // Your development frontend
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
];

const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allows cookies/JWT tokens to be sent
};


app.use(helmet());
// 2. Apply CORS with specific options
app.use(cors(corsOptions)); 
app.use(express.json({ limit: "6mb" }));

// Route Middlewares
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/profile", profileRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


// Global Error Handler
app.use(errorHandler);

export default app;