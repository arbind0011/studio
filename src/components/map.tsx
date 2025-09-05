"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { useSearchParams } from 'next/navigation';
import { Loader } from './loader';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from "@/components/ui/card";
import { Route } from 'lucide-react';

export function Map() {
  const [center, setCenter] = useState<{ lat: number, lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [isMapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const destinationLat = searchParams.get('destinationLat');
  const destinationLng = searchParams.get('destinationLng');
  const destination = destinationLat && destinationLng ? { lat: parseFloat(destinationLat), lng: parseFloat(destinationLng) } : null;
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to retrieve your location. Using a default location.",
            variant: "destructive"
          });
          setCenter({ lat: 40.7128, lng: -74.0060 }); // Fallback location
        }
      );
    } else {
        toast({
            title: "Geolocation not supported",
            description: "Your browser does not support geolocation. Using a default location.",
            variant: "destructive"
          });
        setCenter({ lat: 40.7128, lng: -74.0060 }); // Fallback location
    }
  }, [toast]);
  
  const directionsCallback = useCallback((
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && response) {
      setDirections(response);
    } else {
      console.error(`error fetching directions ${status}`);
      if (status !== 'ZERO_RESULTS') { // Avoid showing error for no-route-found cases
        toast({
            title: "Navigation Error",
            description: "Could not calculate the route to the destination.",
            variant: "destructive"
        });
      }
    }
  }, [toast]);

  if (loadError) {
    return <div className='p-4 text-center text-destructive'>Error loading map. Please ensure your Google Maps API key is valid, has billing enabled, and is correctly configured in the .env file.</div>;
  }

  if (!isLoaded || !center) {
    return <Loader />;
  }

  const travelInfo = directions?.routes[0]?.legs[0];

  return (
    <>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={12}
        onLoad={() => setMapLoaded(true)}
        options={{
            disableDefaultUI: true,
            zoomControl: true,
        }}
      >
        {isMapLoaded && destination && center && !directions && (
            <DirectionsService
                options={{
                    destination: destination,
                    origin: center,
                    travelMode: google.maps.TravelMode.DRIVING,
                }}
                callback={directionsCallback}
            />
        )}

        {directions ? (
            <DirectionsRenderer
                options={{
                    directions: directions,
                    suppressMarkers: true, // We'll render our own markers
                }}
            />
        ) : (
            <Marker position={center} title="Your Location" />
        )}
        
        {destination && (
             <Marker position={destination} title="Destination"/>
        )}

        {directions && travelInfo?.start_location && (
             <Marker position={travelInfo.start_location} title="Your Location"/>
        )}

      </GoogleMap>
      {travelInfo && (
        <Card className="absolute top-4 left-4 z-10">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <Route className="w-8 h-8 text-primary"/>
                    <div>
                        <p className="font-bold text-lg">{travelInfo.duration?.text}</p>
                        <p className="text-sm text-muted-foreground">{travelInfo.distance?.text}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}
    </>
  );
}
