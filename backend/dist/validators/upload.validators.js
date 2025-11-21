"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presignSchema = void 0;
const zod_1 = require("zod");
exports.presignSchema = zod_1.z.object({
    query: zod_1.z.object({
        filename: zod_1.z.string().min(1),
        contentType: zod_1.z.literal("application/pdf")
    })
});
