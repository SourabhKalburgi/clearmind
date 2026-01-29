import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DecisionLoading() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-6 w-2/3" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Options Skeleton */}
                <Card>
                    <CardHeader>
                        <CardTitle><Skeleton className="h-6 w-20" /></CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                        <Skeleton className="h-9 w-32" />
                    </CardContent>
                </Card>

                {/* Criteria Skeleton */}
                <Card>
                    <CardHeader>
                        <CardTitle><Skeleton className="h-6 w-20" /></CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                        <Skeleton className="h-9 w-32" />
                    </CardContent>
                </Card>
            </div>

            {/* Scoring Skeleton */}
            <Card>
                <CardHeader>
                    <CardTitle><Skeleton className="h-6 w-20" /></CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}
