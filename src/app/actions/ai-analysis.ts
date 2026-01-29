"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "dummy_key", // Fallback to avoid init crash ifenv missing, though logic handles call failure
});

export async function analyzeDecision(decisionId: string): Promise<string> {
    const session = await auth();
    if (!session?.user?.id) return "Error: Unauthorized";

    try {
        // Fetch full decision context
        const decision = await prisma.decision.findUnique({
            where: {
                id: decisionId,
                userId: session.user.id,
            },
            include: {
                options: {
                    include: {
                        scores: true
                    }
                },
                criteria: true
            }
        });

        if (!decision) return "Error: Decision not found";

        if (!process.env.GROQ_API_KEY) {
            return "AI Analysis is currently unavailable (Missing API Key).";
        }

        // Format data for prompt
        const optionsList = decision.options.map((opt: any) => `• ${opt.title}`).join("\n");
        const criteriaList = decision.criteria.map((crit: any) => `${crit.name} (Weight: ${crit.weight})`).join("\n");

        const scoresMapping = decision.options.map((opt: any) => {
            const scores = opt.scores.map((s: any) => {
                const critName = decision.criteria.find((c: any) => c.id === s.criterionId)?.name || "Unknown";
                return `${critName}: ${s.value}`;
            }).join(", ");
            return `${opt.title}: [${scores}]`;
        }).join("\n");


        const prompt = `You are a critical thinking assistant.

The user is making an important decision using a structured model.

Decision:
${decision.title}

Context:
${decision.context || "No context provided"}

Options:
${optionsList}

Criteria and importance:
${criteriaList}

Scores:
${scoresMapping}

Your task:
- Identify possible blind spots or missing criteria
- Point out potential cognitive or emotional biases
- Highlight risks or second-order effects
- Suggest 3 reflective questions the user should consider

Rules:

- Be concise and practical
- Output plain text only`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 1024,
        });

        return chatCompletion.choices[0]?.message?.content || "No analysis returned.";
    } catch (error) {
        console.error("AI Analysis failed:", error);
        return "Analysis failed. Please try again later.";
    }
}
