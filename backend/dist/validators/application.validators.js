"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationSchema = void 0;
const zod_1 = require("zod");
exports.createApplicationSchema = zod_1.z.object({
    body: zod_1.z.object({
        jobId: zod_1.z.string(),
        resumeUrl: zod_1.z.string().url(),
        originalFileName: zod_1.z.string(),
        fileSize: zod_1.z.number().max(5000000, "Resume must be <= 5MB"),
        coverLetter: zod_1.z.string().optional()
    })
});
