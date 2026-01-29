"use client";

import { createDecision } from "@/app/actions/decision";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { createDecisionSchema, CreateDecisionSchema } from "@/lib/validations/decision";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function NewDecisionPage() {
    const form = useForm<CreateDecisionSchema>({
        resolver: zodResolver(createDecisionSchema),
        defaultValues: {
            title: "",
            context: "",
        },
    });

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex flex-col items-start justify-between gap-6 border-b border-border/40 pb-6 mb-10">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        New Decision
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        What are you trying to decide? Give it a title and some context to get started.
                    </p>
                </div>
            </div>

            <Card className="border-2 shadow-lg">
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form action={createDecision} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Choosing a new car"
                                                className="h-11 text-base"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-sm">
                                            A short, descriptive title for your decision.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="context"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Context (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the situation, constraints, or any other relevant details."
                                                className="resize-none h-36 text-base"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-sm">
                                            Provide additional context to help you make a better decision.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end pt-4">
                                <Button type="submit" size="lg" className="px-8">
                                    Create Decision
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
