"use client";

import { deleteCriterion, editCriterion } from "@/app/actions/criterion";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { criterionSchema, CriterionSchema } from "@/lib/validations/criterion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Trash2, X, Check } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Criterion } from "@prisma/client";

import { useRouter } from "next/navigation";

interface CriterionItemProps {
    criterion: Criterion;
    index: number;
}

export function CriterionItem({ criterion, index }: CriterionItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const form = useForm<CriterionSchema>({
        resolver: zodResolver(criterionSchema) as any,
        defaultValues: {
            name: criterion.name,
            weight: criterion.weight,
        },
    });

    const onEdit = async (data: CriterionSchema) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("weight", data.weight.toString());

        try {
            await editCriterion(criterion.id, formData);
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };

    const onDelete = async () => {
        if (confirm("Are you sure you want to delete this criterion?")) {
            await deleteCriterion(criterion.id);
            router.refresh();
        }
    };

    if (isEditing) {
        return (
            <div className="border rounded-md p-3 bg-muted/30">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onEdit)} className="flex items-start gap-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-muted-foreground w-6">#{index}</span>
                                            <Input {...field} className="h-8" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="w-20">
                                    {/* Tooltip for Weight could go here */}
                                    <Select onValueChange={(val: string) => field.onChange(parseInt(val))} defaultValue={field.value.toString()}>
                                        <FormControl>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="W" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5].map((w) => (
                                                <SelectItem key={w} value={w.toString()}>
                                                    W: {w}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
        <div className="group flex items-center justify-between rounded-lg border-2 p-4 hover:shadow-md transition-all duration-200 border-border hover:border-primary/20">
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-6">#{index}</span>
                <Badge variant="outline" className="h-7 px-2 flex items-center justify-center p-0 rounded-lg font-bold text-sm bg-primary/10 border-primary/20 text-primary" title="Criterion Weight">
                    W: {criterion.weight}
                </Badge>
                <div className="font-semibold text-sm">{criterion.name}</div>
            </div>
            <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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
