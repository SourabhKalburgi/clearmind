import { z } from "zod";

export const optionSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be less than 100 characters"),
    description: z.string().optional(),
});

export type OptionSchema = z.infer<typeof optionSchema>;
