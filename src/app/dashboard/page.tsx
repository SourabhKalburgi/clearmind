import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createDecision } from "@/app/actions/decision";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DeleteDecisionButton } from "@/components/decision/delete-decision-button";
import { DecisionCard } from "@/components/decision/decision-card";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const decisions = await prisma.decision.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-border/40 pb-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Manage your decisions and track your choices
                    </p>
                </div>
                <Link href="/decision/new">
                    <Button size="lg" className="group shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:-translate-y-0.5">
                        <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90 group-hover:scale-110" />
                        New Decision
                    </Button>
                </Link>
            </div>

            {/* Decisions Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {decisions.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center border border-dashed border-border/60 rounded-3xl bg-muted/5 backdrop-blur-sm">
                        <div className="bg-background p-6 rounded-full mb-6 shadow-xl shadow-primary/5 border border-border/50 ring-4 ring-muted/20">
                            <Plus className="h-10 w-10 text-muted-foreground/60" />
                        </div>
                        <h3 className="font-bold text-2xl mb-3 tracking-tight">No decisions yet</h3>
                        <p className="text-muted-foreground mb-8 max-w-md text-base leading-relaxed">
                            Create your first decision matrix to start evaluating options clearly and make better choices.
                        </p>
                        <Link href="/decision/new">
                            <Button size="lg" variant="secondary" className="group border border-border/50">
                                <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                                Create Your First Decision
                            </Button>
                        </Link>
                    </div>
                ) : (
                    decisions.map((decision) => (
                        <DecisionCard key={decision.id} decision={decision} />
                    ))
                )}
            </div>
        </div>
    );
}
