"use client";

import React, { useState } from "react";
import Image from "next/image";
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
import { BedDouble, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  preferences: z.string().min(10, { message: "Please describe your preferences in more detail." }),
});

type FormValues = z.infer<typeof formSchema>;
type Recommendation = { name: string; description: string; address: string; imageUrl: string; latitude: number; longitude: number; };

export default function HotelsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
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
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec) => (
                    <Link key={rec.name} href={`/dashboard?destinationLat=${rec.latitude}&destinationLng=${rec.longitude}`} className="block">
                        <Card className="flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1">
                            <div className="relative h-48 w-full">
                                <Image src={rec.imageUrl} alt={rec.name} fill className="object-cover rounded-t-lg" data-ai-hint="hotel building" />
                            </div>
                            <CardHeader>
                                <CardTitle className="font-headline flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 rounded-full">
                                        <BedDouble className="w-5 h-5 text-primary"/>
                                    </div>
                                    {rec.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground text-sm font-body mb-2">{rec.description}</p>
                                <p className="text-xs font-medium text-foreground flex items-center gap-1"><MapPin className="w-3 h-3"/>{rec.address}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
