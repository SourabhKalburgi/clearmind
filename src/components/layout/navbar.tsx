import Link from "next/link";
import { UserNav } from "@/components/layout/user-nav";
import { auth } from "@/auth";
import { Brain, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function Navbar() {
    const session = await auth();
    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex h-16 items-center px-6">
                <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity group">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        ClearMind
                    </span>
                </Link>

                {/* Developer Attribution */}
                <div className="ml-auto flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted/70 transition-colors">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground font-medium">Developed by</span>
                            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                Sourabh Kalburgi
                            </span>
                        </div>
                        <div className="flex items-center gap-1 border-l border-border/50 pl-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                                asChild
                            >
                                <a
                                    href="https://github.com/SourabhKalburgi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub Profile"
                                >
                                    <Github className="h-4 w-4" />
                                </a>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                                asChild
                            >
                                <a
                                    href="https://www.linkedin.com/in/sourabh-kalburgi-6a51b720a/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn Profile"
                                >
                                    <Linkedin className="h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile: Compact social links only */}
                    <div className="flex md:hidden items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                            asChild
                        >
                            <a
                                href="https://github.com/SourabhKalburgi"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub Profile"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                            asChild
                        >
                            <a
                                href="https://www.linkedin.com/in/sourabh-kalburgi-6a51b720a/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn Profile"
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>

                    <UserNav user={session?.user || {}} />
                </div>
            </div>
        </div>
    );
}
