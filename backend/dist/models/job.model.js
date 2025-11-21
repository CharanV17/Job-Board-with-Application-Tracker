"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const JobSchema = new mongoose_1.Schema({
    employer: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    remote: { type: Boolean, default: false },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    tags: [String],
    status: { type: String, enum: ["open", "closed"], default: "open" },
    applicantCount: { type: Number, default: 0 },
}, { timestamps: true });
JobSchema.index({ title: "text", description: "text" });
exports.default = (0, mongoose_1.model)("Job", JobSchema);
