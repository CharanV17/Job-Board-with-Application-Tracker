"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ApplicationSchema = new mongoose_1.Schema({
    job: { type: mongoose_1.Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: { type: String, required: true },
    originalFileName: String,
    fileSize: Number,
    coverLetter: String,
    status: {
        type: String,
        enum: ["Applied", "Screening", "Interview", "Offer", "Rejected"],
        default: "Applied",
    },
    statusHistory: [
        {
            status: String,
            changedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
            at: Date,
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Application", ApplicationSchema);
