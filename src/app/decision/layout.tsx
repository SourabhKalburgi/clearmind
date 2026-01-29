import { Navbar } from "@/components/layout/navbar";

export default function DecisionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex-col md:flex min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            <Navbar />
            <main className="flex-1 space-y-4 p-6 md:p-8 pt-6 max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
