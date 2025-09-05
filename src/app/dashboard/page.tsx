"use client";

import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast"
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [inArea, setInArea] = useState(false);
  const { toast } = useToast()

  const handleEnter = () => {
    setInArea(true);
    toast({
      title: "Welcome to the Tourist District!",
      description: "We're glad you're here. Check out the attractions tab for personalized suggestions.",
    })
  };

  const handleExit = () => {
    setInArea(false);
    toast({
      title: "Hope you enjoyed your visit!",
      description: "Thanks for exploring with Bulbul. We've logged your trip details for you.",
      variant: "default",
    })
  };

  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Sparkles className="text-accent"/>
              Geofencing Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This is a simulation of entering and exiting a geofenced tourist area.
            </p>
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <p className="font-medium">
                  {inArea
                    ? "You are currently in the Downtown Arts & Culture district."
                    : "You are currently outside any designated tourist area."
                  }
                </p>
                {!inArea ? (
                    <Button onClick={handleEnter}>Simulate Entering Area</Button>
                ) : (
                    <Button onClick={handleExit} variant="outline">Simulate Exiting Area</Button>
                )}
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center text-muted-foreground mt-8">
            <p>Use the sidebar to explore AI-powered recommendations.</p>
        </div>
      </div>
    </AppShell>
  );
}
