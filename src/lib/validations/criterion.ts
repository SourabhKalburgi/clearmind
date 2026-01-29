import { z } from "zod";

export const criterionSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters"),
    weight: z.coerce
        .number()
        .min(1, "Weight must be at least 1")
        .max(5, "Weight must be at most 5"),
});

export type CriterionSchema = z.infer<typeof criterionSchema>;
