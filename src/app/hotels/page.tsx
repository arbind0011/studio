"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/loader";
import { getHotelRecommendations } from "./actions";
import { BedDouble, Sparkles } from "lucide-react";

const formSchema = z.object({
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  preferences: z.string().min(10, { message: "Please describe your preferences in more detail." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function HotelsPage() {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      preferences: "Looking for a mid-range hotel with a pool and free breakfast.",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    const result = await getHotelRecommendations(data);

    if (result.error) {
      setError(result.error);
    } else {
      setRecommendations(result.recommendations || null);
    }
    setIsLoading(false);
  };

  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Hotel Recommendations</h1>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Find Your Perfect Stay</CardTitle>
                <CardDescription>
                    Let our AI assistant find the best hotels for you based on your location and preferences.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Destination</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Paris, France" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="preferences"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Preferences</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="e.g., budget-friendly, good for families, pet-friendly, etc."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Searching..." : "Find Hotels"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
        
        {isLoading && <Loader />}
        
        {error && <p className="text-destructive text-center">{error}</p>}

        {recommendations && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Sparkles className="text-accent" />
                Here are your recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 whitespace-pre-wrap font-body">
                {recommendations.split('\n\n').map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-background flex gap-4 items-start transition-all hover:shadow-md hover:border-primary/50">
                        <div className="p-2 bg-primary/20 rounded-full">
                            <BedDouble className="w-6 h-6 text-primary"/>
                        </div>
                        <p>{rec.trim()}</p>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
