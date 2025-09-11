"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { useSearchParams } from 'next/navigation';
import { Loader } from './loader';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from "@/components/ui/card";
import { Route } from 'lucide-react';

export function Map(props: { destinationLat?: number, destinationLng?: number }) {
  const [center, setCenter] = useState<{ lat: number, lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const lastStateRef = useRef<string | null>(null);
  const lastGeocodePositionRef = useRef<{ lat: number, lng: number } | null>(null);

  const destinationLat = props.destinationLat || searchParams.get('destinationLat');
  const destinationLng = props.destinationLng || searchParams.get('destinationLng');
  const destination = destinationLat && destinationLng ? { lat: parseFloat(destinationLat as string), lng: parseFloat(destinationLng as string) } : null;
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places', 'geocoding'],
  });

  const handleStateChange = useCallback((newState: string) => {
    const previousState = lastStateRef.current;
    if (newState && newState !== previousState) {
        if (previousState) {
            toast({
                title: `Thank you for visiting ${previousState}!`,
                description: `We hope you had a wonderful time.`
            });
        }
        toast({
            title: `Welcome to ${newState}!`,
            description: `Enjoy your journey through the state.`
        });
        lastStateRef.current = newState;
    }
  }, [toast]);
  
  const reverseGeocode = useCallback((location: { lat: number; lng: number }) => {
    if (!geocoderRef.current) {
        if (window.google) {
            geocoderRef.current = new window.google.maps.Geocoder();
        } else {
            return; // Google Maps API not ready
        }
    }
    geocoderRef.current.geocode({ location }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const stateComponent = results[0].address_components.find(
          (c) => c.types.includes('administrative_area_level_1')
        );
        if (stateComponent) {
          handleStateChange(stateComponent.long_name);
        }
      }
    });
  }, [handleStateChange]);

  useEffect(() => {
    let watchId: number;

    if (isLoaded) {
      const handlePositionUpdate = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        const newCenter = { lat: latitude, lng: longitude };
        setCenter(newCenter);

        const lastPos = lastGeocodePositionRef.current;
        if (lastPos) {
            lastGeocodePositionRef.current = newCenter;
            reverseGeocode(newCenter);
        }
      };

      const handlePositionError = () => {
        toast({
          title: "Location Error",
          description: "Unable to retrieve your location. Using a default location.",
          variant: "destructive"
        });
        const fallbackCenter = { lat: 40.7128, lng: -74.0060 };
        setCenter(fallbackCenter);
        reverseGeocode(fallbackCenter);
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handlePositionUpdate, handlePositionError);
        watchId = navigator.geolocation.watchPosition(handlePositionUpdate, handlePositionError, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      } else {
        toast({
            title: "Geolocation not supported",
            description: "Your browser does not support geolocation. Using a default location.",
            variant: "destructive"
        });
        const fallbackCenter = { lat: 40.7128, lng: -74.0060 };
        setCenter(fallbackCenter);
        reverseGeocode(fallbackCenter);
      }
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isLoaded, toast, reverseGeocode]);
  
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
    console.error("Google Maps Load Error:", loadError);
    return <div className='p-4 text-center text-destructive'>Error loading map. Please ensure your Google Maps API key is valid, has billing enabled, and is correctly configured in the .env file. Check the browser console for more details.</div>;
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
        options={{
            disableDefaultUI: true,
            zoomControl: true,
        }}
      >
        {isLoaded && destination && center && !directions && (
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
                    suppressMarkers: true, 
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
