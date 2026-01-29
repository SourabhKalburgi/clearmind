"use client";

import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteDecisionButton } from "./delete-decision-button";
import type { Decision } from "@prisma/client";

export function DecisionCard({ decision }: { decision: Decision }) {
    const router = useRouter();

    const handleCardClick = (e: React.MouseEvent) => {
        // Only navigate if the click target is not the delete button or its children
        const target = e.target as HTMLElement;
        if (!target.closest('button[data-delete-button]') && !target.closest('[role="alertdialog"]')) {
            router.push(`/decision/${decision.id}`);
        }
    };

    return (
        <div className="h-full">
            <Card
                className="group relative overflow-hidden h-full border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 cursor-pointer"
                onClick={handleCardClick}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="pb-3 relative z-10">
                    <div className="flex justify-between items-start gap-3">
                        <CardTitle className="line-clamp-2 text-xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
                            {decision.title}
                        </CardTitle>
                        <Badge
                            variant={decision.status === "DECIDED" ? "default" : "secondary"}
                            className={`shrink-0 transition-colors ${decision.status === "DECIDED" ? "bg-green-500/15 text-green-700 dark:text-green-300 hover:bg-green-500/25 border-green-500/20" : "bg-secondary/50 text-secondary-foreground hover:bg-secondary/80"}`}
                        >
                            {decision.status}
                        </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2 mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(decision.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="mb-4">
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {decision.context || "No context provided."}
                        </p>
                    </div>
                    <div className="flex justify-end pt-2 border-t border-border/30">
                        <DeleteDecisionButton decisionId={decision.id} decisionTitle={decision.title} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
