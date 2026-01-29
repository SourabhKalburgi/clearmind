"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { optionSchema } from "@/lib/validations/option";
import { revalidatePath } from "next/cache";

export async function addOption(decisionId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify ownership
    const decision = await prisma.decision.findUnique({
        where: { id: decisionId, userId: session.user.id },
    });
    if (!decision) throw new Error("Unauthorized or Decision not found");

    const rawData = {
        title: (formData.get("title") as string) || "",
        description: (formData.get("description") as string) || undefined,
    };

    const validation = optionSchema.safeParse(rawData);
    if (!validation.success) throw new Error("Validation Failed");

    await prisma.option.create({
        data: {
            decisionId,
            title: validation.data.title,
            description: validation.data.description,
        },
    });

    revalidatePath(`/decision/${decisionId}`);
}

export async function editOption(optionId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const rawData = {
        title: (formData.get("title") as string) || "",
        description: (formData.get("description") as string) || undefined,
    };

    const validation = optionSchema.safeParse(rawData);
    if (!validation.success) throw new Error("Validation Failed");

    // Verify ownership via nested query
    const option = await prisma.option.findFirst({
        where: {
            id: optionId,
            decision: {
                userId: session.user.id,
            },
        },
    });

    if (!option) throw new Error("Unauthorized or Option not found");

    await prisma.option.update({
        where: { id: optionId },
        data: {
            title: validation.data.title,
            description: validation.data.description,
        },
    });

    const decisionId = option.decisionId;
    revalidatePath(`/decision/${decisionId}`);
}

export async function deleteOption(optionId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify ownership
    const option = await prisma.option.findFirst({
        where: {
            id: optionId,
            decision: {
                userId: session.user.id,
            },
        },
    });

    if (!option) throw new Error("Unauthorized or Option not found");

    await prisma.option.delete({
        where: { id: optionId },
    });

    const decisionId = option.decisionId;
    revalidatePath(`/decision/${decisionId}`);
}
