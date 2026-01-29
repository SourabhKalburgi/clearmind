"use client";

import { calculateWeightedSum } from "@/lib/logic";

import { updateScore } from "@/app/actions/score";
import { Input } from "@/components/ui/input";
import { Criterion, Option, Score } from "@prisma/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ScoringTableProps {
    options: (Option & { scores: Score[] })[];
    criteria: Criterion[];
}

export function ScoringTable({ options, criteria }: ScoringTableProps) {
    const router = useRouter();
    // Maintain local state of scores for optimistic updates
    // Map of `${optionId}-${criterionId}` -> score value
    const [localScores, setLocalScores] = useState<Record<string, number>>({});

    // Initialize local scores from props
    useEffect(() => {
        const initialScores: Record<string, number> = {};
        options.forEach(opt => {
            opt.scores.forEach(score => {
                initialScores[`${opt.id}-${score.criterionId}`] = score.value;
            });
        });
        setLocalScores(initialScores);
    }, [options]); // Depend on options to reset if they change (e.g. after refresh)

    const handleScoreChange = async (optionId: string, criterionId: string, value: string) => {
        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue < 1 || numValue > 5) return;

        // Optimistic update
        const key = `${optionId}-${criterionId}`;
        setLocalScores(prev => ({ ...prev, [key]: numValue }));

        try {
            await updateScore(optionId, criterionId, numValue);
            router.refresh();
        } catch (error) {
            console.error("Failed to update score:", error);
            // Revert on error (optional, simplified here)
        }
    };

    const calculateTotalScore = (optionId: string) => {
        const inputs = criteria.map(crit => ({
            weight: crit.weight,
            value: localScores[`${optionId}-${crit.id}`] || 0
        }));
        return calculateWeightedSum(inputs);
    };

    const optionTotals = options.map(opt => ({ id: opt.id, total: calculateTotalScore(opt.id) }));
    const maxTotal = Math.max(...optionTotals.map(o => o.total), 0);

    if (options.length === 0 || criteria.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                <div className="text-muted-foreground">Add options and criteria to unlock scoring.</div>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md shadow-xl overflow-hidden ring-1 ring-border/50">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border/60 bg-muted/40 backdrop-blur-sm">
                            <th className="p-4 font-semibold w-1/4 min-w-[150px] text-muted-foreground uppercase tracking-wider text-xs">Criteria \ Options</th>
                            {options.map(opt => {
                                const isWinner = optionTotals.find(t => t.id === opt.id)?.total === maxTotal && maxTotal > 0;
                                return (
                                    <th key={opt.id} className={`p-4 font-semibold text-center min-w-[120px] relative transition-colors duration-300 ${isWinner ? "bg-primary/5" : ""}`}>
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="line-clamp-1 font-bold text-foreground text-sm" title={opt.title}>{opt.title}</span>
                                            {isWinner && (
                                                <span className="animate-in fade-in zoom-in duration-300 text-[10px] uppercase tracking-wider font-bold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-0.5 rounded-full shadow-[0_0_10px_-3px_rgba(0,0,0,0.2)] dark:shadow-[0_0_15px_-3px_rgba(255,255,255,0.1)]">
                                                    Best Choice
                                                </span>
                                            )}
                                        </div>
                                        {isWinner && <div className="absolute inset-x-0 top-0 h-0.5 bg-primary/50" />}
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {criteria.map(crit => (
                            <tr key={crit.id} className="group hover:bg-muted/5 transition-colors duration-200">
                                <td className="p-4 font-medium relative">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 text-xs font-bold bg-muted text-muted-foreground rounded-lg border border-border/50 shadow-sm group-hover:scale-110 transition-transform" title={`Weight: ${crit.weight}`}>
                                            x{crit.weight}
                                        </div>
                                        <span className="line-clamp-2 text-foreground/90 group-hover:text-foreground transition-colors" title={crit.name}>{crit.name}</span>
                                    </div>
                                </td>
                                {options.map(opt => {
                                    const scoreValue = localScores[`${opt.id}-${crit.id}`];
                                    const isWinner = optionTotals.find(t => t.id === opt.id)?.total === maxTotal && maxTotal > 0;
                                    return (
                                        <td key={`${opt.id}-${crit.id}`} className={`p-3 text-center transition-colors duration-300 relative ${isWinner ? "bg-primary/5" : ""}`}>
                                            <div className="h-full w-full flex items-center justify-center">
                                                <ScoreInput
                                                    value={scoreValue}
                                                    onChange={(val) => handleScoreChange(opt.id, crit.id, val)}
                                                    className={isWinner ? "border-primary/20 bg-background/50 focus:border-primary" : ""}
                                                />
                                            </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                        {/* Total Row */}
                        <tr className="bg-muted/20 font-medium">
                            <td className="p-5 text-base text-muted-foreground">Total Score</td>
                            {options.map(opt => {
                                const total = optionTotals.find(t => t.id === opt.id)?.total || 0;
                                const isWinner = total === maxTotal && maxTotal > 0;
                                return (
                                    <td key={opt.id} className={`p-4 text-center transition-all duration-300 ${isWinner ? "bg-primary/10" : ""}`}>
                                        <div className={`text-2xl font-black tracking-tight ${isWinner ? "text-primary scale-110 transform" : "text-muted-foreground"}`}>
                                            {total}
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ScoreInput({ value, onChange, className }: { value?: number, onChange: (val: string) => void, className?: string }) {
    const displayValue = value?.toString() || "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue === "" || (/^[1-5]$/.test(newValue))) {
            if (newValue !== displayValue) {
                onChange(newValue);
            }
        }
    };

    return (
        <Input
            className={`w-14 h-10 text-center font-bold text-lg shadow-sm border-2 transition-all duration-200 
                ${displayValue ? 'bg-background border-border text-foreground hover:border-primary/50' : 'bg-muted/30 border-transparent text-muted-foreground/50 hover:bg-background hover:border-border'} 
                focus:w-20 focus:scale-110 focus:z-10 focus:ring-4 focus:ring-primary/10 focus:border-primary ${className}`}
            value={displayValue}
            onChange={handleChange}
            maxLength={1}
            placeholder="-"
        />
    )
}
