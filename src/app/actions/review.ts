"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations/review";
import { revalidatePath } from "next/cache";

export async function submitReview(decisionId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify ownership
    const decision = await prisma.decision.findUnique({
        where: { id: decisionId, userId: session.user.id },
    });

    if (!decision) throw new Error("Unauthorized or Decision not found");

    const rawData = {
        outcomeText: formData.get("outcomeText") as string,
        successRating: formData.get("successRating") as string,
    };

    const validation = reviewSchema.safeParse(rawData);

    if (!validation.success) {
        throw new Error("Validation Failed");
    }

    // Create Review
    await prisma.review.create({
        data: {
            decisionId,
            outcomeText: validation.data.outcomeText,
            successRating: validation.data.successRating,
        },
    });

    // Update Decision Status
    await prisma.decision.update({
        where: { id: decisionId },
        data: {
            status: "REVIEWED",
        },
    });

    revalidatePath(`/decision/${decisionId}`);
}
