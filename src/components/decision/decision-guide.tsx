"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function DecisionGuide() {
    const [isOpen, setIsOpen] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm mb-6">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <HelpCircle className="h-5 w-5" />
                        How this Decision Matrix Works
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100/50"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100/50"
                            onClick={() => setIsVisible(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                {!isOpen && (
                    <CardDescription className="text-blue-600/80 dark:text-blue-400">
                        Click to expand the guide on how to use Weighted Decision Analysis.
                    </CardDescription>
                )}
            </CardHeader>
            <div
                className={cn(
                    "grid transition-all duration-200 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="overflow-hidden">
                    <CardContent className="pt-0 text-sm text-muted-foreground space-y-4">
                        <p>
                            This tool helps you make objective decisions by breaking them down into <strong>Options</strong> and <strong>Criteria</strong>.
                        </p>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-background/80 p-3 rounded-lg border">
                                <h4 className="font-semibold text-foreground mb-1">1. Define Options</h4>
                                <p className="text-xs">
                                    List the choices you are deciding between.
                                    <br />
                                    <span className="italic text-muted-foreground/80">Example: "MacBook Pro", "Dell XPS", "ThinkPad"</span>
                                </p>
                            </div>
                            <div className="bg-background/80 p-3 rounded-lg border">
                                <h4 className="font-semibold text-foreground mb-1">2. Set Criteria</h4>
                                <p className="text-xs">
                                    What matters most? Assign a <strong>Weight (1-5)</strong> to each.
                                    <br />
                                    <span className="italic text-muted-foreground/80">Example: "Price" (Weight: 5), "Portability" (Weight: 3)</span>
                                </p>
                            </div>
                            <div className="bg-background/80 p-3 rounded-lg border">
                                <h4 className="font-semibold text-foreground mb-1">3. Score & Analyze</h4>
                                <p className="text-xs">
                                    Rate each option (1-5) for every criterion.
                                    <br />
                                    <span className="font-mono text-[10px] bg-muted px-1 rounded">Score = (Rating × Weight) + ...</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-100/50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-900/50">
                            <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">🏆 How the Winner is Calculated</p>
                            <p className="text-xs text-blue-700/80 dark:text-blue-400">
                                The option with the highest total Weighted Score is highlighted as the best choice. This method ensures that your most important criteria (highest weights) have the biggest impact on the final decision.
                            </p>
                        </div>
                    </CardContent>
                </div>
            </div>
        </Card>
    );
}
