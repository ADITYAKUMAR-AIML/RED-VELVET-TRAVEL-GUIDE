"use client";

import dynamic from "next/dynamic";
import React from "react";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] rounded-[2.5rem] bg-neutral-100 dark:bg-neutral-800 animate-pulse flex items-center justify-center">
      <div className="text-neutral-400 font-medium">Loading Map...</div>
    </div>
  ),
});

import { geocodeLocation } from "@/lib/geocoding";

interface MapMarker {
  id: string | number;
  lat: number;
  lng: number;
  name: string;
  image: string;
  location: string;
}

interface LeafletMapProps {
  markers?: any[]; // Flexible input
  lat?: number | null;
  lng?: number | null;
  name?: string;
  image?: string;
  location?: string;
  selectedId?: string | number | null;
}

export function LeafletMap({ 
  markers: providedMarkers, 
  lat, 
  lng, 
  name, 
  image, 
  location,
  selectedId
}: LeafletMapProps) {
  const [resolvedMarkers, setResolvedMarkers] = React.useState<MapMarker[]>([]);

  React.useEffect(() => {
    async function resolve() {
      if (providedMarkers && providedMarkers.length > 0) {
        const resolved = await Promise.all(providedMarkers.map(async (m) => {
          if (m.latitude && m.longitude) {
            return {
              id: m.id,
              lat: m.latitude,
              lng: m.longitude,
              name: m.title || m.name,
              image: m.image_url || m.image,
              location: m.location || m.country || m.destination
            };
          }
          // Geocode if missing
          const coords = await geocodeLocation(m.location || m.title || m.name || "");
          return {
            id: m.id,
            lat: coords?.lat ?? 20.5937,
            lng: coords?.lng ?? 78.9629,
            name: m.title || m.name,
            image: m.image_url || m.image,
            location: m.location || m.country || m.destination
          };
        }));
        setResolvedMarkers(resolved);
        return;
      }

      // Single marker mode
      if (name && image && location) {
        if (lat && lng) {
          setResolvedMarkers([{
            id: 'single',
            lat,
            lng,
            name,
            image,
            location
          }]);
        } else {
          const coords = await geocodeLocation(location);
          setResolvedMarkers([{
            id: 'single',
            lat: coords?.lat ?? 20.5937,
            lng: coords?.lng ?? 78.9629,
            name,
            image,
            location
          }]);
        }
      }
    }
    resolve();
  }, [providedMarkers, lat, lng, name, image, location]);

  return (
    <div className="relative w-full h-full">
      <MapComponent 
        markers={resolvedMarkers}
        selectedId={selectedId}
      />
    </div>
  );
}
