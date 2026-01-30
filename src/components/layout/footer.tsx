import Link from "next/link";
import { Github, Linkedin, Heart, Code } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative mt-auto border-t border-border/40 bg-gradient-to-r from-primary/5 via-background to-primary/5 backdrop-blur-sm">
            {/* Decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Left side - Made with love */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Code className="h-4 w-4 text-primary animate-pulse" />
                        <span>Crafted with</span>
                        <Heart className="h-4 w-4 text-red-500 animate-pulse" fill="currentColor" />
                        <span>by</span>
                        <span className="font-semibold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Sourabh Kalburgi
                        </span>
                    </div>

                    {/* Right side - Social links */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="https://www.linkedin.com/in/sourabh-kalburgi-6a51b720a/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative p-2.5 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                        >
                            <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                            <span className="sr-only">LinkedIn</span>
                            {/* Tooltip */}
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover border border-border rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                LinkedIn
                            </span>
                        </Link>

                        <Link
                            href="https://github.com/SourabhKalburgi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative p-2.5 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-600/10 hover:from-purple-500/20 hover:to-pink-600/20 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
                        >
                            <Github className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                            <span className="sr-only">GitHub</span>
                            {/* Tooltip */}
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover border border-border rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                GitHub
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Bottom text - Copyright */}
                <div className="mt-4 pt-4 border-t border-border/20 text-center">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} ClearMind. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.05),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(236,72,153,0.05),transparent_50%)] pointer-events-none" />
        </footer>
    );
}
