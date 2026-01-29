"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createDecisionSchema } from "@/lib/validations/decision";

export async function createDecision(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const rawData = {
        title: formData.get("title") as string,
        context: formData.get("context") as string,
    };

    const validation = createDecisionSchema.safeParse(rawData);

    if (!validation.success) {
        // In a real app, we would return errors to the client
        // For now, we will just throw
        throw new Error("Validation Failed");
    }

    const decision = await prisma.decision.create({
        data: {
            title: validation.data.title,
            context: validation.data.context,
            userId: session.user.id,
            status: "DRAFT",
        },
    });

    redirect(`/decision/${decision.id}`);
}

import { revalidatePath } from "next/cache";

export async function markOptionAsChosen(decisionId: string, optionId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify ownership
    const decision = await prisma.decision.findUnique({
        where: { id: decisionId, userId: session.user.id },
    });

    if (!decision) throw new Error("Unauthorized or Decision not found");

    await prisma.decision.update({
        where: { id: decisionId },
        data: {
            chosenOptionId: optionId,
            status: "DECIDED",
        },
    });

    revalidatePath(`/decision/${decisionId}`);
}

export async function deleteDecision(decisionId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify ownership
    const decision = await prisma.decision.findUnique({
        where: { id: decisionId, userId: session.user.id },
    });

    if (!decision) throw new Error("Unauthorized or Decision not found");

    await prisma.decision.delete({
        where: { id: decisionId },
    });

    revalidatePath("/dashboard");
}
