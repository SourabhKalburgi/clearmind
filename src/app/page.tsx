import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, CheckCircle2, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-24 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Make Better Decisions</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            ClearMind
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform complex decisions into clear choices with our intelligent decision matrix tool
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6 h-auto group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 mt-24 grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Analysis</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered insights help you understand your options better
            </p>
          </div>
          
          <div className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Weighted Scoring</h3>
            <p className="text-sm text-muted-foreground">
              Evaluate options against multiple criteria with customizable weights
            </p>
          </div>
          
          <div className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Outcomes</h3>
            <p className="text-sm text-muted-foreground">
              Review your decisions and learn from past choices
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
