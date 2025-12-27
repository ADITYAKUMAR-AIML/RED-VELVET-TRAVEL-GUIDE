"use client";

import React, { useEffect, useState, useMemo, memo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { geocodeLocation } from "@/lib/geocoding";

interface FlightMapProps {
  origin: string;
  destination: string;
}

// Helper to auto-center the map on both markers
const MapBounds = memo(function MapBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }
  }, [points, map]);
  return null;
});

const FlightMap = memo(function FlightMap({ origin, destination }: FlightMapProps) {
  const [coords, setCoords] = useState<{
    origin: [number, number] | null;
    destination: [number, number] | null;
  }>({ origin: null, destination: null });

  useEffect(() => {
    let isMounted = true;
    async function getCoords() {
      try {
        const [originRes, destRes] = await Promise.all([
          geocodeLocation(origin),
          geocodeLocation(destination)
        ]);
        
        if (isMounted && originRes && destRes) {
          setCoords({
            origin: [originRes.lat, originRes.lng],
            destination: [destRes.lat, destRes.lng]
          });
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    }
    getCoords();
    return () => { isMounted = false; };
  }, [origin, destination]);

  const positions = useMemo<[number, number][] | null>(() => {
    if (!coords.origin || !coords.destination) return null;
    return [coords.origin, coords.destination];
  }, [coords.origin, coords.destination]);

  const mapContent = useMemo(() => {
    if (!coords.origin || !coords.destination || !positions) return null;

    return (
      <>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          updateWhenIdle={true}
          updateWhenZooming={false}
          keepBuffer={2}
        />
        <Marker position={coords.origin}>
          <Popup className="font-bold">Origin: {origin}</Popup>
        </Marker>
        <Marker position={coords.destination}>
          <Popup className="font-bold">Destination: {destination}</Popup>
        </Marker>
        <Polyline 
          positions={positions} 
          color="#dc2626" 
          weight={4} 
          dashArray="10, 10" 
          opacity={0.8} 
        />
        <MapBounds points={positions} />
      </>
    );
  }, [coords.origin, coords.destination, positions, origin, destination]);

  if (!coords.origin || !coords.destination) {
    return (
      <div className="w-full h-[400px] bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-[2.5rem] flex items-center justify-center">
        <p className="text-neutral-500 font-bold">Calculating flight path...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 z-0">
      <MapContainer 
        center={coords.origin} 
        zoom={4} 
        className="h-full w-full"
        scrollWheelZoom={false}
        preferCanvas={true}
      >
        {mapContent}
      </MapContainer>
    </div>
  );
});

export default FlightMap;
