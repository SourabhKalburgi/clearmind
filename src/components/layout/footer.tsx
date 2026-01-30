import Link from "next/link";
import { Brain, Github, Linkedin, Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand Section */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                ClearMind
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Make Better Decisions
                            </span>
                        </div>
                    </div>

                    {/* Creator Info */}
                    <div className="flex flex-col items-center md:items-end gap-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Crafted with</span>
                            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
                            <span>by</span>
                            <span className="font-semibold text-foreground">Sourabh Kalburgi</span>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="https://github.com/SourabhKalburgi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                            >
                                <Github className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                    GitHub
                                </span>
                            </Link>

                            <Link
                                href="https://www.linkedin.com/in/sourabh-kalburgi-6a51b720a/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                            >
                                <Linkedin className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                    LinkedIn
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-6 pt-6 border-t border-border/50">
                    <p className="text-center text-xs text-muted-foreground">
                        © {new Date().getFullYear()} ClearMind. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
