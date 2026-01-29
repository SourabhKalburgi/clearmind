"use client";

import { deleteOption, editOption } from "@/app/actions/option";
import { markOptionAsChosen } from "@/app/actions/decision";
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
import { Edit2, Trash2, X, Check, Trophy } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Option } from "@prisma/client";

interface OptionItemProps {
    option: Option;
    isChosen?: boolean;
    decisionId?: string;
}

export function OptionItem({ option, isChosen, decisionId }: OptionItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const form = useForm<OptionSchema>({
        resolver: zodResolver(optionSchema),
        defaultValues: {
            title: option.title,
            description: option.description || "",
        },
    });

    const onEdit = async (data: OptionSchema) => {
        const formData = new FormData();
        formData.append("title", data.title);
        if (data.description) formData.append("description", data.description);

        try {
            await editOption(option.id, formData);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    const onDelete = async () => {
        if (confirm("Are you sure you want to delete this option?")) {
            await deleteOption(option.id);
        }
    };

    const onMarkAsChosen = async () => {
        if (!decisionId) return;
        try {
            await markOptionAsChosen(decisionId, option.id);
        } catch (error) {
            console.error(error);
        }
    }

    if (isEditing) {
        return (
            <div className="border rounded-md p-3 bg-muted/30">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onEdit)} className="flex items-start gap-2">
                        <div className="flex-1 space-y-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} className="h-8" />
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
                                            <Input {...field} placeholder="Description" className="h-8 text-xs" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex gap-1">
                            <Button type="submit" size="icon" variant="ghost" className="h-8 w-8 text-green-600">
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => setIsEditing(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        );
    }

    return (
        <div className={`group flex items-start justify-between rounded-lg border-2 p-4 hover:shadow-md transition-all duration-200 ${isChosen ? "bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-900/10 border-yellow-300 dark:border-yellow-700 shadow-md" : "border-border hover:border-primary/20"}`}>
            <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-semibold text-sm">{option.title}</div>
                    {isChosen && (
                        <div className="text-[10px] font-bold uppercase tracking-wider bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Trophy className="h-3 w-3" />
                            Chosen
                        </div>
                    )}
                </div>
                {option.description && (
                    <div className="text-xs text-muted-foreground leading-relaxed">{option.description}</div>
                )}
            </div>
            <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ml-2">
                {!isChosen && decisionId && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 text-xs hover:bg-primary/10"
                        onClick={onMarkAsChosen}
                    >
                        Mark as Chosen
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-primary/10"
                    onClick={() => setIsEditing(true)}
                >
                    <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={onDelete}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}
