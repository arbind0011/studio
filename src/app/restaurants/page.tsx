"use client";

import React, { useState } from "react";
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

const formSchema = z.object({
  preferences: z.string().min(5, { message: "Please describe your preferences." }),
});

type FormValues = z.infer<typeof formSchema>;
type Coordinates = { latitude: number; longitude: number };

export default function RestaurantsPage() {
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
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
                <CardTitle className="font-headline">Discover Local Flavors</CardTitle>
                <CardDescription>
                    Get AI-powered suggestions for the best local restaurants, cafes, and eateries.
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
                                <FormLabel>Cuisine & Preferences</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="e.g., cheap eats, vegan options, romantic ambiance, etc."
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
                Bon Appétit! Here are your tasty options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-background flex gap-4 items-start transition-all hover:shadow-md hover:scale-105 hover:border-primary/50">
                        <div className="p-2 bg-primary/20 rounded-full">
                            <UtensilsCrossed className="w-6 h-6 text-primary"/>
                        </div>
                        <p className="font-body">{rec.trim()}</p>
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
