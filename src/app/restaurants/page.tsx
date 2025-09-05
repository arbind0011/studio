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
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/loader";
import { getRestaurantRecommendations } from "./actions";
import { UtensilsCrossed, Sparkles, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const formSchema = z.object({
  preferences: z.string().min(5, { message: "Please describe your preferences." }),
});

type FormValues = z.infer<typeof formSchema>;
type Coordinates = { latitude: number; longitude: number };
type Recommendation = { name: string; description: string; address: string; imageUrl: string; latitude: number; longitude: number; };

export default function RestaurantsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferences: "Craving authentic Italian pizza and pasta.",
    },
  });

  const handleGetLocation = () => {
    setLocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast({ title: "Location captured!", description: "Your current location has been successfully recorded." });
        },
        () => {
          setLocationError("Unable to retrieve your location. Please grant permission and try again.");
          toast({ title: "Location Error", description: "Could not access your location. Please check browser permissions.", variant: "destructive" });
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      toast({ title: "Browser not supported", description: "Your browser does not support geolocation.", variant: "destructive" });
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!location) {
      setLocationError("Please provide your location before searching.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    const input = { ...data, ...location };
    const result = await getRestaurantRecommendations(input);

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
            <h1 className="text-3xl font-bold tracking-tight font-headline">Restaurant Recommendations</h1>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Find Your Next Meal</CardTitle>
                <CardDescription>
                    Discover local restaurants, cafes, and eateries based on your cravings.
                </CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormItem>
                        <FormLabel>Your Location</FormLabel>
                        <div className="flex items-center gap-4">
                            <Button type="button" variant="outline" onClick={handleGetLocation}>
                                <MapPin className="mr-2 h-4 w-4" /> Get My Location
                            </Button>
                            {location && <p className="text-sm text-green-600">Location captured successfully!</p>}
                        </div>
                        {locationError && <p className="text-sm font-medium text-destructive">{locationError}</p>}
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="preferences"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Preferences & Cravings</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="e.g., spicy ramen, vegetarian options, family-friendly, etc."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Searching..." : "Find Restaurants"}
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
                Bon Appétit!
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec) => (
                    <Link key={rec.name} href={`/dashboard?destinationLat=${rec.latitude}&destinationLng=${rec.longitude}`} className="block">
                        <Card className="flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1">
                            <div className="relative h-48 w-full">
                                <Image src={rec.imageUrl} alt={rec.name} fill className="object-cover rounded-t-lg" data-ai-hint="restaurant food" />
                            </div>
                            <CardHeader>
                                <CardTitle className="font-headline flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 rounded-full">
                                        <UtensilsCrossed className="w-5 h-5 text-primary"/>
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
