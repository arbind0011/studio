
"use client";

import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Loader } from './loader';
import { useToast } from '@/hooks/use-toast';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0 0 0.5rem 0.5rem'
};

export function Map() {
  const [center, setCenter] = useState<{ lat: number, lng: number } | null>(null);
  const { toast } = useToast();
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
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
            description: "Unable to retrieve your location. Please grant permission and try again.",
            variant: "destructive"
          });
        }
      );
    } else {
        toast({
            title: "Geolocation not supported",
            description: "Your browser does not support geolocation.",
            variant: "destructive"
          });
    }
  }, [toast]);

  if (loadError) {
    return <div className='p-4 text-center text-destructive'>Error loading map. Please ensure your Google Maps API key is valid and correctly configured in the .env file.</div>;
  }

  if (!isLoaded || !center) {
    return <Loader />;
  }

  return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        <Marker position={center} />
      </GoogleMap>
  );
}
