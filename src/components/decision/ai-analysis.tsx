"use client";

import { analyzeDecision } from "@/app/actions/ai-analysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Loader2, Sparkles, Lock } from "lucide-react";
import { useState } from "react";
import { Criterion, Option, Score } from "@prisma/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isDecisionMatrixComplete } from "@/lib/logic";

interface AIAnalysisProps {
    decisionId: string;
    options: (Option & { scores: Score[] })[];
    criteria: Criterion[];
}

export function AIAnalysis({ decisionId, options, criteria }: AIAnalysisProps) {
    const [feedback, setFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // precision validation: use shared logic
    const isComplete = isDecisionMatrixComplete(options, criteria);

    // For tooltip stats (re-calculate locally to respect UI needs)
    const totalRequiredScores = options.length * criteria.length;
    let currentScoreCount = 0;
    options.forEach(opt => {
        criteria.forEach(crit => {
            const hasScore = opt.scores.some(s => s.criterionId === crit.id);
            if (hasScore) currentScoreCount++;
        });
    });

    const handleAnalyze = async () => {
        if (!isComplete) return;
        setLoading(true);
        try {
            const result = await analyzeDecision(decisionId);
            setFeedback(result);
        } catch (error) {
            console.error(error);
            setFeedback("An error occurred while fetching analysis.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {!feedback && (
                <div className="flex justify-center sm:justify-start">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span tabIndex={0}> {/* Wrapper for disabled button tooltip trigger */}
                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={loading || !isComplete}
                                        className={`relative w-full sm:w-auto transition-all duration-500 overflow-hidden font-medium
                                            ${isComplete
                                                ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] border-0"
                                                : "bg-muted text-muted-foreground border-2 border-dashed cursor-not-allowed"
                                            }
                                        `}
                                        size="lg"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Analyzing Matrix...
                                            </>
                                        ) : (
                                            <>
                                                {isComplete ? (
                                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] -skew-x-12 translate-x-[-200%]" />
                                                ) : null}

                                                {isComplete ? (
                                                    <Sparkles className="mr-2 h-4 w-4 animate-pulse text-yellow-200" />
                                                ) : (
                                                    <Lock className="mr-2 h-4 w-4" />
                                                )}

                                                Challenge My Thinking

                                                {isComplete && (
                                                    <span className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                                        AI
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            {!isComplete && (
                                <TooltipContent className="max-w-xs">
                                    <p>Please fill in scores for all options and criteria (Total: {currentScoreCount}/{totalRequiredScores}) to unlock AI analysis.</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}

            {feedback && (
                <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl border-t-4 border-t-indigo-500">
                    <CardHeader className="pb-3 border-b border-indigo-100/50">
                        <CardTitle className="flex items-center gap-2 text-indigo-900">
                            <BrainCircuit className="h-6 w-6 text-indigo-600" />
                            AI Analysis
                            <span className="ml-auto text-xs font-normal text-indigo-500 bg-indigo-100/50 px-2 py-1 rounded-full border border-indigo-200">
                                GPT-4 Model
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {feedback}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => setFeedback(null)} className="text-muted-foreground hover:text-indigo-600 hover:border-indigo-200">
                                Close Analysis
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
