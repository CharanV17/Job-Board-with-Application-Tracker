import { z } from "zod";

export const createApplicationSchema = z.object({
  body: z.object({
    jobId: z.string(),
    resumeUrl: z.string().url(),
    originalFileName: z.string(),
    fileSize: z.number().max(5_000_000, "Resume must be <= 5MB"),
    coverLetter: z.string().optional()
  })
});
