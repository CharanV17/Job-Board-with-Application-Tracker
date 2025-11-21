"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobSchema = exports.createJobSchema = void 0;
const zod_1 = require("zod");
exports.createJobSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3),
        description: zod_1.z.string().min(10),
        location: zod_1.z.string(),
        remote: zod_1.z.boolean().optional(),
        salaryMin: zod_1.z.number().optional(),
        salaryMax: zod_1.z.number().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional()
    })
});
exports.updateJobSchema = exports.createJobSchema; // same fields allowed
