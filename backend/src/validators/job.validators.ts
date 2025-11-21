import { z } from "zod";

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    location: z.string(),
    remote: z.boolean().optional(),
    salaryMin: z.number().optional(),
    salaryMax: z.number().optional(),
    tags: z.array(z.string()).optional()
  })
});

export const updateJobSchema = createJobSchema; // same fields allowed
