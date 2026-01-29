"use client";

import { addCriterion } from "@/app/actions/criterion";
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
import { criterionSchema, CriterionSchema } from "@/lib/validations/criterion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddCriterionFormProps {
    decisionId: string;
}

export function AddCriterionForm({ decisionId }: AddCriterionFormProps) {
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();
    const form = useForm<CriterionSchema>({
        resolver: zodResolver(criterionSchema) as any,
        defaultValues: {
            name: "",
            weight: 1,
        },
    });

    const onSubmit = async (data: CriterionSchema) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("weight", data.weight.toString());

        try {
            await addCriterion(decisionId, formData);
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
                Add Criterion
            </Button>
        );
    }

    return (
        <div className="border-2 rounded-lg p-4 bg-gradient-to-br from-muted/50 to-muted/30 shadow-md">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <div className="flex gap-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input placeholder="Criterion Name (e.g. Cost)" className="h-10" {...field} autoFocus />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="w-28">
                                    <Select onValueChange={(val: string) => field.onChange(parseInt(val))} defaultValue={field.value.toString()}>
                                        <FormControl>
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Weight" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5].map((w) => (
                                                <SelectItem key={w} value={w.toString()}>
                                                    {w}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

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
