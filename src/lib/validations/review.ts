import { z } from "zod";

export const reviewSchema = z.object({
    outcomeText: z
        .string()
        .min(10, "Outcome description must be at least 10 characters")
        .max(1000, "Outcome description must be less than 1000 characters"),
    successRating: z.coerce
        .number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5"),
});

export type ReviewSchema = z.infer<typeof reviewSchema>;
