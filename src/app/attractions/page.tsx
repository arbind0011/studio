"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader } from "@/components/loader";
import { getAttractionSuggestions } from "./actions";
import { Landmark, Sparkles, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const formSchema = z.object({
  interests: z.string().min(3, { message: "Please list at least one interest." }),
  weather: z.enum(["Sunny", "Cloudy", "Rainy"]),
});

type FormValues = z.infer<typeof formSchema>;
type Coordinates = { latitude: number; longitude: number };
type Suggestion = { name: string; description: string; address: string; imageUrl: string; latitude: number; longitude: number; };

export default function AttractionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: "",
      weather: "Sunny",
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

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!location) {
      setLocationError("Please provide your location before searching.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    const input = { 
      ...data, 
      ...location,
      timeOfDay: getTimeOfDay()
    };
    const result = await getAttractionSuggestions(input);

    if (result.error) {
      setError(result.error);
    } else {
      setSuggestions(result.suggestions || null);
    }
    setIsLoading(false);
  };

  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Nearby Attractions</h1>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Explore Your Surroundings</CardTitle>
                <CardDescription>
                    Get smart, context-aware suggestions for attractions, landmarks, and points of interest.
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

                        <div className="grid md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="interests"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Your Interests</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., museums, parks, nightlife" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="weather"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Current Weather</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select current weather" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        <SelectItem value="Sunny">Sunny</SelectItem>
                                        <SelectItem value="Cloudy">Cloudy</SelectItem>
                                        <SelectItem value="Rainy">Rainy</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Searching..." : "Suggest Attractions"}
                        </Button>                    
                    </form>
                </Form>
            </CardContent>
        </Card>
        
        {isLoading && <Loader />}
        
        {error && <p className="text-destructive text-center">{error}</p>}

        {suggestions && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Sparkles className="text-accent" />
                Start Your Adventure!
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((item) => (
                    <Link key={item.name} href={`/dashboard?destinationLat=${item.latitude}&destinationLng=${item.longitude}`} className="block">
                        <Card className="flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1">
                            <div className="relative h-48 w-full">
                                <Image src={item.imageUrl} alt={item.name} fill className="object-cover rounded-t-lg" data-ai-hint="attraction" />
                            </div>
                            <CardHeader>
                                <CardTitle className="font-headline flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 rounded-full">
                                        <Landmark className="w-5 h-5 text-primary"/>
                                    </div>
                                    {item.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground text-sm font-body mb-2">{item.description}</p>
                                <p className="text-xs font-medium text-foreground flex items-center gap-1"><MapPin className="w-3 h-3"/>{item.address}</p>
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
