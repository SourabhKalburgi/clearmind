import { z } from "zod";

export const scoreSchema = z.object({
    value: z.coerce
        .number()
        .min(1, "Score must be at least 1")
        .max(5, "Score must be at most 5"),
});

export type ScoreSchema = z.infer<typeof scoreSchema>;
