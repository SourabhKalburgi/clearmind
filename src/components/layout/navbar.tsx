import Link from "next/link";
import { UserNav } from "@/components/layout/user-nav";
import { auth } from "@/auth";
import { Brain } from "lucide-react";

export async function Navbar() {
    const session = await auth();
    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex h-16 items-center px-6">
                <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2 text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity group">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        ClearMind
                    </span>
                </Link>
                <div className="ml-auto flex items-center space-x-4">
                    {session?.user && <UserNav user={session.user} />}
                </div>
            </div>
        </div>
    );
}
