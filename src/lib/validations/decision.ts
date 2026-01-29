import { z } from "zod";

export const createDecisionSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),
    context: z.string().optional(),
});

export type CreateDecisionSchema = z.infer<typeof createDecisionSchema>;
