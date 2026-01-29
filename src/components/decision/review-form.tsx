"use client";

import { submitReview } from "@/app/actions/review";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { reviewSchema, ReviewSchema } from "@/lib/validations/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
    decisionId: string;
}

export function ReviewForm({ decisionId }: ReviewFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<ReviewSchema>({
        resolver: zodResolver(reviewSchema) as any,
        defaultValues: {
            outcomeText: "",
            successRating: 0,
        },
    });

    const onSubmit = async (data: ReviewSchema) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("outcomeText", data.outcomeText);
        formData.append("successRating", data.successRating.toString());

        try {
            await submitReview(decisionId, formData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="border rounded-md p-6 bg-muted/20 space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Review Outcome</h3>
                <p className="text-sm text-muted-foreground">
                    Reflect on how this decision turned out.
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="successRating"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Success Rating</FormLabel>
                                <FormControl>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => field.onChange(star)}
                                                className={cn(
                                                    "p-1 hover:scale-110 transition-transform",
                                                    field.value >= star
                                                        ? "text-yellow-500 fill-yellow-500"
                                                        : "text-muted-foreground"
                                                )}
                                            >
                                                <Star className={cn("h-6 w-6", field.value >= star && "fill-current")} />
                                            </button>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="outcomeText"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Outcome Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="What happened? Was it the right choice?"
                                        className="resize-none"
                                        rows={4}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
