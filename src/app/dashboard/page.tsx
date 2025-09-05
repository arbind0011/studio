"use client";

import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from '@/components/map';
import { MapPin } from 'lucide-react';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <MapPin className="text-accent"/>
              Your Current Location
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[500px] p-0">
            <Map />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
