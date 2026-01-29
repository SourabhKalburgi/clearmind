"use client";

import { addOption } from "@/app/actions/option";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { optionSchema, OptionSchema } from "@/lib/validations/option";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddOptionFormProps {
    decisionId: string;
}

export function AddOptionForm({ decisionId }: AddOptionFormProps) {
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();
    const form = useForm<OptionSchema>({
        resolver: zodResolver(optionSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const onSubmit = async (data: OptionSchema) => {
        const formData = new FormData();
        formData.append("title", data.title);
        if (data.description) formData.append("description", data.description);

        try {
            await addOption(decisionId, formData);
            form.reset();
            setIsAdding(false);
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };

    if (!isAdding) {
        return (
            <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground hover:text-foreground border-2 border-dashed hover:border-primary/40 transition-all group"
                onClick={() => setIsAdding(true)}
            >
                <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                Add Option
            </Button>
        );
    }

    return (
        <div className="border-2 rounded-lg p-4 bg-gradient-to-br from-muted/50 to-muted/30 shadow-md">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Option Title" className="h-10" {...field} autoFocus />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Description (optional)" className="h-10" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-2 justify-end pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsAdding(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" className="px-6">
                            Add
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
