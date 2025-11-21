"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const jobs_routes_1 = __importDefault(require("./routes/jobs.routes"));
const applications_routes_1 = __importDefault(require("./routes/applications.routes"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "6mb" }));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/jobs", jobs_routes_1.default);
app.use("/api/applications", applications_routes_1.default);
app.use("/api/uploads", upload_routes_1.default);
// health
app.get("/healthz", (req, res) => res.sendStatus(200));
app.use(errorHandler_1.default);
exports.default = app;
