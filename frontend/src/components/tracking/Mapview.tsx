import { useEffect, useState, useRef } from "react";
import { Parcel } from "@/lib/types";

interface MapViewProps {
  parcels: Parcel[];
}

export  function MapView({ parcels }: MapViewProps) {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Center coordinates for Udupi, Karnataka, India
  const udupiCoordinates = [13.3409, 74.7421];

  useEffect(() => {
    if (!mapLoaded && typeof window !== "undefined") {
      // Create script elements for Leaflet CSS and JS
      const linkEl = document.createElement("link");
      linkEl.rel = "stylesheet";
      linkEl.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
      document.head.appendChild(linkEl);

      const scriptEl = document.createElement("script");
      scriptEl.src =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
      scriptEl.onload = initializeMap;
      document.body.appendChild(scriptEl);
    }

    return () => {
      // Cleanup function for when component unmounts
      if (mapRef.current && window.L) {
        window.L.map(mapRef.current).remove();
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return;

    // Initialize map centered on Udupi
    const map = window.L.map(mapRef.current).setView(udupiCoordinates, 13);

    // Add OpenStreetMap tile layer
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Generate random locations around Udupi for parcels
    parcels.forEach((parcel) => {
      // Random offset within ~5km of Udupi center
      const lat = udupiCoordinates[0] + (Math.random() - 0.5) * 0.05;
      const lng = udupiCoordinates[1] + (Math.random() - 0.5) * 0.05;

      const getStatusColor = (status: string) => {
        switch (status) {
          case "on-route":
            return "#4CAF50";
          case "waiting":
            return "#FFC107";
          case "canceled":
            return "#F44336";
          default:
            return "#9E9E9E";
        }
      };

      // Create marker with colored icon
      const icon = window.L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: ${getStatusColor(
          parcel.status
        )}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      // Add marker to map
      const marker = window.L.marker([lat, lng], { icon }).addTo(map);

      // Add popup with parcel info
      marker.bindPopup(`
        <b>Parcel ID:</b> ${parcel.id}<br>
        <b>Status:</b> ${parcel.status}<br>
        <b>Destination:</b> ${parcel.destination || "Unknown"}
      `);
    });

    setMapLoaded(true);
  };

  return (
    <div className="h-full w-full">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div
        ref={mapRef}
        className="h-full w-full bg-gray-100"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}

// Add type definition for Leaflet
declare global {
  interface Window {
    L: any;
  }
}
