"use client";
import { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from "@vis.gl/react-google-maps";

type Driver = {
  id: string;
  name: string;
  status: string;
  location: { lat: number; lng: number };
  vehicle: string;
  currentDelivery: string | null;
  avatar: string;
  rating: number;
  deliveriesCompleted: number;
  phone: string;
};

interface MapViewProps {
  drivers: Driver[];
}

interface MarkerInfo {
  id: string;
  name: string;
  position: google.maps.LatLngLiteral;
}

export function MapView({ drivers }: MapViewProps) {
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);

  // UseEffect to safely update markers only when drivers change(else infinte as whenever rendered it will change)
  useEffect(() => {
    const newMarkers = drivers.map((driver) => ({
      id: driver.id,
      name: driver.name,
      position: {
        lat: driver.location.lat,
        lng: driver.location.lng,
      },
    }));
    setMarkers(newMarkers);
  }, [drivers]);

  return (
    <div className="h-full w-full">
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      >
        <Map
          defaultCenter={
            markers[0]?.position || { lat: 13.340881, lng: 74.742142 }
          }
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID as string}
        >
          {markers.map((marker) => (
            <AdvancedMarker
              key={marker.id}
              position={marker.position}
              onClick={() => setSelectedMarker(marker)}
            >
              <Pin
                background={marker.id === selectedMarker?.id ? "red" : "blue"}
              />
            </AdvancedMarker>
          ))}

          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="bg-white rounded shadow-md">
                <h5>Driver Name:</h5>
                <p className="text-md font-semibold">{selectedMarker.name}</p>
                {/* <p>ID: {selectedMarker.id}</p> */}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
