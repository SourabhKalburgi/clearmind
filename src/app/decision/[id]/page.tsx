import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddOptionForm } from "@/components/decision/add-option-form";
import { OptionItem } from "@/components/decision/option-item";
import { AddCriterionForm } from "@/components/decision/add-criterion-form";
import { CriterionItem } from "@/components/decision/criterion-item";
import { ScoringTable } from "@/components/decision/scoring-table";
import { ReviewForm } from "@/components/decision/review-form";
import { CheckCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIAnalysis } from "@/components/decision/ai-analysis";
import { Navbar } from "@/components/layout/navbar";
import { DecisionGuide } from "@/components/decision/decision-guide";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function DecisionPage({ params }: PageProps) {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    const decision = await prisma.decision.findUnique({
        where: {
            id,
            userId: session.user.id
        },
        include: {
            options: {
                include: {
                    scores: true
                }
            },
            criteria: true,
            reviews: true
        }
    });

    if (!decision) {
        notFound();
    }

    return (
        <div className="flex-col md:flex min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <Navbar />
            <main className="flex-1 space-y-8 p-6 md:p-8 pt-6 max-w-7xl mx-auto w-full pb-12">
                <DecisionGuide />
                {/* Header */}
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between space-y-4 pb-6 border-b">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <a href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </a>
                            <h1 className="text-3xl font-bold tracking-tight">{decision.title}</h1>
                            <Badge variant={decision.status === 'DECIDED' ? 'default' : decision.status === 'REVIEWED' ? 'secondary' : 'outline'}>
                                {decision.status}
                            </Badge>
                        </div>
                        {decision.context && (
                            <p className="text-muted-foreground max-w-2xl text-base">{decision.context}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {new Date(decision.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    {/* Add edit/delete actions here if needed later */}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Options Section */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                                Options
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {decision.options.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                                    <p className="text-sm font-medium mb-1 text-muted-foreground">No options yet</p>
                                    <p className="text-xs text-muted-foreground">Add options to compare.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {decision.options.map((option) => (
                                        <OptionItem
                                            key={option.id}
                                            option={option}
                                            isChosen={decision.chosenOptionId === option.id}
                                            decisionId={decision.id}
                                        />
                                    ))}
                                </div>
                            )}
                            <AddOptionForm decisionId={decision.id} />
                        </CardContent>
                    </Card>

                    {/* Criteria Section */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Criteria
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {decision.criteria.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                                    <p className="text-sm font-medium mb-1 text-muted-foreground">No criteria yet</p>
                                    <p className="text-xs text-muted-foreground">Define what matters for this decision.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {decision.criteria.map((crit, i) => (
                                        <CriterionItem key={crit.id} criterion={crit} index={i + 1} />
                                    ))}
                                </div>
                            )}
                            <AddCriterionForm decisionId={decision.id} />
                        </CardContent>
                    </Card>
                </div>

                {/* Scoring Table Section */}
                <Card className="border-2 shadow-lg">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Scoring Matrix
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScoringTable options={decision.options} criteria={decision.criteria} />
                        <div className="mt-8 border-t pt-6">
                            <AIAnalysis
                                decisionId={decision.id}
                                options={decision.options}
                                criteria={decision.criteria}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Review Section */}
                {decision.status === "DECIDED" && (
                    <Card className="border-2 shadow-lg bg-gradient-to-br from-primary/5 to-transparent">
                        <CardContent className="pt-6">
                            <ReviewForm decisionId={decision.id} />
                        </CardContent>
                    </Card>
                )}

                {decision.status === "REVIEWED" && decision.reviews.length > 0 && (
                    <Card className="bg-gradient-to-br from-green-50/50 to-green-50/20 dark:from-green-950/20 dark:to-green-950/10 border-2 border-green-200 dark:border-green-900 shadow-lg">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                Outcome Review
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {decision.reviews.map((review) => (
                                <div key={review.id} className="space-y-3 p-4 rounded-lg bg-background/50 border border-green-200/50 dark:border-green-900/50">
                                    <div className="flex items-center gap-3">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={cn(
                                                        "h-5 w-5 transition-colors",
                                                        review.successRating >= star
                                                            ? "text-yellow-500 fill-yellow-500"
                                                            : "text-muted-foreground"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-foreground">{review.outcomeText}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* ... other sections ... */}
            </main>
        </div>
    )
}


