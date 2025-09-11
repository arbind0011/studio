
"use client";

import React, { Suspense } from 'react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from '@/components/map';
import { MapPin } from 'lucide-react';
import { Loader } from '@/components/loader';
import { useGeolocated } from 'react-geolocated';

function DashboardContent() {

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: false,
        },
        userDecisionTimeout: 5000,
    });

  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Your Travel Map</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <MapPin className="text-accent"/>
              Map
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[70vh] p-0 relative">
            {
              isGeolocationAvailable && isGeolocationEnabled && coords ? (
                <Map destinationLat={coords.latitude} destinationLng={coords.longitude} />
              ) : (
                <Loader />
              )
            }
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

export default function DashboardPage() {
    return (
      <Suspense fallback={<Loader />}>
        <DashboardContent />
      </Suspense>
    );
}
