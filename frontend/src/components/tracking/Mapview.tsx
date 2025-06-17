// "use client";
// import { useState, useEffect } from "react";
// import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from "@vis.gl/react-google-maps";
// import { getAllDrivers } from "@/lib/types";



// interface MapViewProps {
//   drivers: getAllDrivers[];
// }

// interface MarkerInfo {
//   id: string;
//   name: string;
//   position: google.maps.LatLngLiteral;
// }

// export function MapView({ drivers }: MapViewProps) {
//   const [markers, setMarkers] = useState<MarkerInfo[]>([]);
//   const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);

//   // UseEffect to safely update markers only when drivers change(else infinte as whenever rendered it will change)
//   useEffect(() => {
//     const newMarkers = drivers.map((driver) => ({
//       id: driver.driver_id,
//       name: driver.first_name + " " + driver.last_name,
//       position: {
//         lat: driver.driver_location[0].latitude,
//         lng: driver.driver_location[0].longitude,
//       },
//     }));
//     setMarkers(newMarkers);
//   }, [drivers]);

//   return (
//     <div className="h-full w-full">
//       <APIProvider
//         apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
//       >
//         <Map
//           defaultCenter={
//             markers[0]?.position || { lat: 13.340881, lng: 74.742142 }
//           }
//           defaultZoom={12}
//           gestureHandling="greedy"
//           disableDefaultUI={false}
//           mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID as string}
//         >
//           {markers.map((marker) => (
//             <AdvancedMarker
//               key={marker.id}
//               position={marker.position}
//               onClick={() => setSelectedMarker(marker)}
//             >
//               <Pin
//                 background={marker.id === selectedMarker?.id ? "red" : "blue"}
//               />
//             </AdvancedMarker>
//           ))}

//           {selectedMarker && (
//             <InfoWindow
//               position={selectedMarker.position}
//               onCloseClick={() => setSelectedMarker(null)}
//             >
//               <div className="bg-white rounded shadow-md">
//                 <h5>Driver Name:</h5>
//                 <p className="text-md font-semibold">{selectedMarker.name}</p>
//                 {/* <p>ID: {selectedMarker.id}</p> */}
//               </div>
//             </InfoWindow>
//           )}
//         </Map>
//       </APIProvider>
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";
import { getAllDrivers } from "@/lib/types";

interface MapViewProps {
  drivers: getAllDrivers[];
}

interface MarkerInfo {
  id: string;
  name: string;
  position: google.maps.LatLngLiteral;
}

export function MapView({ drivers }: MapViewProps) {
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);

  // Safely update markers only when drivers change
  useEffect(() => {
    const newMarkers: MarkerInfo[] = drivers
      .filter((driver) => {
        // Filter out drivers without valid location data
        return (
          driver.driver_location &&
          driver.driver_location.length > 0 &&
          driver.driver_location[0].latitude &&
          driver.driver_location[0].longitude &&
          !isNaN(driver.driver_location[0].latitude) &&
          !isNaN(driver.driver_location[0].longitude)
        );
      })
      .map((driver) => ({
        id: driver.driver_id,
        name: `${driver.first_name} ${driver.last_name || ""}`.trim(),
        position: {
          lat: Number(driver.driver_location[0].latitude),
          lng: Number(driver.driver_location[0].longitude),
        },
      }));

    setMarkers(newMarkers);
  }, [drivers]);

  // Calculate center point for the map
  const getMapCenter = (): google.maps.LatLngLiteral => {
    if (markers.length === 0) {
      // Default center (you can change this to your preferred location)
      return { lat: 12.9716, lng: 77.5946 }; // Bangalore coordinates
    }

    const avgLat =
      markers.reduce((sum, marker) => sum + marker.position.lat, 0) /
      markers.length;
    const avgLng =
      markers.reduce((sum, marker) => sum + marker.position.lng, 0) /
      markers.length;

    return { lat: avgLat, lng: avgLng };
  };

  // Handle marker click
  const handleMarkerClick = (marker: MarkerInfo) => {
    setSelectedMarker(marker);
  };

  // Handle info window close
  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <Map
        defaultZoom={12}
        defaultCenter={getMapCenter()}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID"}
        style={{ width: "100%", height: "100%" }}
      >
        {markers.map((marker) => (
          <AdvancedMarker
            key={marker.id}
            position={marker.position}
            onClick={() => handleMarkerClick(marker)}
          >
            <Pin
              background={"#0f9488"}
              borderColor={"#0f9488"}
              glyphColor={"#ffffff"}
            />
          </AdvancedMarker>
        ))}

        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={handleInfoWindowClose}
          >
            <div className="p-2">
              <div className="font-semibold text-sm">Driver Name:</div>
              <div className="text-sm">{selectedMarker.name}</div>
              <div className="text-xs text-gray-600 mt-1">
                ID: {selectedMarker.id}
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}