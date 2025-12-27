"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface MapMarker {
  id: string | number;
  lat: number;
  lng: number;
  name: string;
  image: string;
  location: string;
}

interface MapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  selectedId?: string | number | null;
  className?: string;
}

export default function MapComponent({ 
  markers, 
  center, 
  zoom = 13, 
  selectedId,
  className = "h-full w-full"
}: MapProps) {
  // Calculate center if not provided
  const position: [number, number] = center || (markers.length > 0 
    ? [markers[0].lat, markers[0].lng] 
    : [20.5937, 78.9629]);

  return (
    <div className={`w-full h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 z-0`}>
      <MapContainer 
        center={position} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className={className}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={[marker.lat, marker.lng]}
            opacity={selectedId && selectedId !== marker.id ? 0.6 : 1.0}
          >
            <Popup className="custom-popup">
              <div className="w-56 p-0 overflow-hidden rounded-xl bg-white dark:bg-neutral-900">
                <div className="h-28 w-full overflow-hidden">
                  <img src={marker.image} alt={marker.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1 line-clamp-1">{marker.name}</h3>
                  <p className="text-[10px] text-neutral-500 flex items-center gap-1">
                    <span className="block w-2 h-2 rounded-full bg-red-500"></span>
                    {marker.location}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
