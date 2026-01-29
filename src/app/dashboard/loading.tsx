import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3 rounded-xl border p-6">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
