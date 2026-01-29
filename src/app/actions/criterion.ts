"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { criterionSchema } from "@/lib/validations/criterion";
import { revalidatePath } from "next/cache";

export async function addCriterion(decisionId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify ownership
    const decision = await prisma.decision.findUnique({
        where: { id: decisionId, userId: session.user.id },
    });
    if (!decision) throw new Error("Unauthorized or Decision not found");

    const rawData = {
        name: (formData.get("name") as string) || "",
        weight: (formData.get("weight") as string) || "1",
    };

    const validation = criterionSchema.safeParse(rawData);
    if (!validation.success) throw new Error("Validation Failed");

    await prisma.criterion.create({
        data: {
            decisionId,
            name: validation.data.name,
            weight: validation.data.weight,
        },
    });

    revalidatePath(`/decision/${decisionId}`);
}

export async function editCriterion(criterionId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const rawData = {
        name: (formData.get("name") as string) || "",
        weight: (formData.get("weight") as string) || "1",
    };

    const validation = criterionSchema.safeParse(rawData);
    if (!validation.success) throw new Error("Validation Failed");

    // Verify ownership via nested query
    const criterion = await prisma.criterion.findFirst({
        where: {
            id: criterionId,
            decision: {
                userId: session.user.id,
            },
        },
    });

    if (!criterion) throw new Error("Unauthorized or Criterion not found");

    await prisma.criterion.update({
        where: { id: criterionId },
        data: {
            name: validation.data.name,
            weight: validation.data.weight,
        },
    });

    const decisionId = criterion.decisionId;
    revalidatePath(`/decision/${decisionId}`);
}

export async function deleteCriterion(criterionId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify ownership
    const criterion = await prisma.criterion.findFirst({
        where: {
            id: criterionId,
            decision: {
                userId: session.user.id,
            },
        },
    });

    if (!criterion) throw new Error("Unauthorized or Criterion not found");

    await prisma.criterion.delete({
        where: { id: criterionId },
    });

    const decisionId = criterion.decisionId;
    revalidatePath(`/decision/${decisionId}`);
}
