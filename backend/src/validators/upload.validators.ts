import { z } from "zod";

export const presignSchema = z.object({
  query: z.object({
    filename: z.string().min(1),
    contentType: z.literal("application/pdf")
  })
});
