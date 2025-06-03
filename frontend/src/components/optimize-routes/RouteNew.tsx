// "use client";
// // components/RouteVisualization.tsx
// import React, { useState, useEffect, useCallback } from "react";
// import {
//   APIProvider,
//   Map,
//   Marker,
//   InfoWindow,
//   useMap,
// } from "@vis.gl/react-google-maps";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { MapPin, Navigation, Clock, User, Phone } from "lucide-react";
// import { getRouteByDriverIdAndDate } from "@/lib/clientSideDataServices";

// interface RouteWaypoint {
//   lat: number;
//   lng: number;
//   address: string;
//   delivery_id?: string;
// }

// interface RouteDelivery {
//   delivery_id: string;
//   sequence: number;
//   estimated_arrival: string;
//   travel_time_from_previous: number;
// }

// interface RouteData {
//   route_id: string;
//   driver_id: string;
//   route_details: {
//     driver_id: string;
//     driver_name: string;
//     deliveries: RouteDelivery[];
//     route_geometry: {
//       waypoints: RouteWaypoint[];
//       encoded_polyline?: string;
//       total_distance: number;
//       total_duration: number;
//     };
//     total_deliveries: number;
//     start_time: string;
//     estimated_end_time: string;
//   };
//   Assignment: Array<{
//     delivery: {
//       delivery_id: string;
//       dropoff_location: string;
//       priority: number;
//       customer: {
//         name: string;
//         phone: string;
//         address: string;
//       };
//     };
//     sequence_number: number;
//     estimated_arrival: string;
//   }>;
// }

// interface RouteVisualizationProps {
//   driverId: string;
//   date: string;
//   onRouteSelect?: (routeId: string) => void;
// }

// // Component for handling directions
// const DirectionsComponent: React.FC<{ route: RouteData }> = ({ route }) => {
//   const map = useMap();
//   const [directionsRenderer, setDirectionsRenderer] =
//     useState<google.maps.DirectionsRenderer | null>(null);

//   const calculateDirections = useCallback(() => {
//     if (!map || !route.route_details.route_geometry.waypoints.length) return;

//     const waypoints = route.route_details.route_geometry.waypoints;
//     if (waypoints.length < 2) return;

//     // Create directions renderer if it doesn't exist
//     if (!directionsRenderer) {
//       const renderer = new google.maps.DirectionsRenderer({
//         suppressMarkers: false,
//         polylineOptions: {
//           strokeColor: "#4285f4",
//           strokeWeight: 4,
//           strokeOpacity: 0.8,
//         },
//       });
//       renderer.setMap(map);
//       setDirectionsRenderer(renderer);
//     }

//     const origin = waypoints[0];
//     const destination = waypoints[waypoints.length - 1];
//     const waypointsForDirections = waypoints.slice(1, -1).map((wp) => ({
//       location: { lat: wp.lat, lng: wp.lng },
//       stopover: true,
//     }));

//     const directionsService = new google.maps.DirectionsService();

//     directionsService.route(
//       {
//         origin: { lat: origin.lat, lng: origin.lng },
//         destination: { lat: destination.lat, lng: destination.lng },
//         waypoints: waypointsForDirections,
//         optimizeWaypoints: false,
//         travelMode: google.maps.TravelMode.DRIVING,
//         unitSystem: google.maps.UnitSystem.METRIC,
//       },
//       (result, status) => {
//         if (
//           status === google.maps.DirectionsStatus.OK &&
//           result &&
//           directionsRenderer
//         ) {
//           directionsRenderer.setDirections(result);
//         } else {
//           console.error("Directions request failed:", status);
//         }
//       }
//     );
//   }, [map, route, directionsRenderer]);

//   useEffect(() => {
//     calculateDirections();
//   }, [calculateDirections]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (directionsRenderer) {
//         directionsRenderer.setMap(null);
//       }
//     };
//   }, [directionsRenderer]);

//   return null; // This component doesn't render anything directly
// };

// // Main component
// export const RouteVisualization: React.FC<RouteVisualizationProps> = ({
//   driverId,
//   date,
//   onRouteSelect,
// }) => {
//   const [routes, setRoutes] = useState<RouteData[]>([]);
//   const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFetching, setIsFetching] = useState(false);
//   const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

//   // Default center (Manipal coordinates)
//   const defaultCenter = { lat: 13.3479, lng: 74.7824 };

//   // Fetch routes when component mounts or dependencies change
//   useEffect(() => {
//     if (driverId && date) {
//       fetchRoutes();
//     }
//   }, [driverId, date]);

//   const fetchRoutes = async () => {
//     if (isFetching) {
//       console.log("Already fetching, skipping...");
//       return;
//     }
//     setIsLoading(true);
//     setIsFetching(true);
//     try {
//       const response = await getRouteByDriverIdAndDate(driverId, date);
//       if (response.status < 200 || response.status >= 300) {
//         throw new Error("Failed to fetch routes");
//       }

//       const apiResponse = response.data;
//       const routesData = apiResponse.data || [];

//       console.log("API Response:", apiResponse);
//       console.log("Routes Data:", routesData);

//       setRoutes(routesData);
//       if (routesData.length > 0) {
//         setSelectedRoute(routesData[0]);
//       }
//     } catch (error) {
//       console.error("Error fetching routes:", error);
//     } finally {
//       setIsLoading(false);
//       setIsFetching(false);
//     }
//   };

//   const getPriorityColor = (priority: number) => {
//     switch (priority) {
//       case 1:
//         return "#ef4444"; // red for high priority
//       case 2:
//         return "#f59e0b"; // amber for medium priority
//       case 3:
//         return "#10b981"; // green for low priority
//       default:
//         return "#6b7280"; // gray for default
//     }
//   };

//   const formatDuration = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours}h ${minutes}m`;
//   };

//   const formatDistance = (meters: number) => {
//     const km = meters / 1000;
//     return `${km.toFixed(1)} km`;
//   };

//   // Create custom marker icon
//   const createMarkerIcon = (sequenceNumber: number, priority: number) => {
//     const svg = `
//       <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
//         <circle cx="20" cy="20" r="18" fill="${getPriorityColor(
//           priority
//         )}" stroke="white" stroke-width="3"/>
//         <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
//           ${sequenceNumber}
//         </text>
//       </svg>
//     `;
//     return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2">Loading routes...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Route Selection */}
//       {routes.length > 1 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Available Routes</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex gap-2 flex-wrap">
//               {routes.map((route, index) => (
//                 <Button
//                   key={route.route_id}
//                   variant={
//                     selectedRoute?.route_id === route.route_id
//                       ? "default"
//                       : "outline"
//                   }
//                   onClick={() => {
//                     setSelectedRoute(route);
//                     onRouteSelect?.(route.route_id);
//                   }}
//                   className="text-sm"
//                 >
//                   Route {index + 1} ({route.route_details.total_deliveries}{" "}
//                   stops)
//                 </Button>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Route Details */}
//       {selectedRoute && (
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//           {/* Route Info */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Navigation className="w-5 h-5" />
//                 Route Overview
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Driver:</span>
//                   <span className="font-medium">
//                     {selectedRoute.route_details.driver_name}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Deliveries:</span>
//                   <span className="font-medium">
//                     {selectedRoute.route_details.total_deliveries}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Distance:</span>
//                   <span className="font-medium">
//                     {formatDistance(
//                       selectedRoute.route_details.route_geometry.total_distance
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Duration:</span>
//                   <span className="font-medium">
//                     {formatDuration(
//                       selectedRoute.route_details.route_geometry.total_duration
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Start Time:</span>
//                   <span className="font-medium">
//                     {new Date(
//                       selectedRoute.route_details.start_time
//                     ).toLocaleTimeString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Est. End:</span>
//                   <span className="font-medium">
//                     {new Date(
//                       selectedRoute.route_details.estimated_end_time
//                     ).toLocaleTimeString()}
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Map */}
//           <Card className="xl:col-span-2">
//             <CardHeader>
//               <CardTitle>Route Map</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="w-full h-96 rounded-lg border overflow-hidden">
//                 <APIProvider
//                   apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
//                 >
//                   <Map
//                     style={{ width: "100%", height: "100%" }}
//                     defaultCenter={defaultCenter}
//                     defaultZoom={12}
//                     gestureHandling="greedy"
//                     disableDefaultUI={false}
//                   >
//                     {/* Directions */}
//                     {selectedRoute && (
//                       <DirectionsComponent route={selectedRoute} />
//                     )}

//                     {/* Delivery Markers */}
//                     {selectedRoute?.Assignment.map((assignment) => {
//                       const waypoint =
//                         selectedRoute.route_details.route_geometry.waypoints.find(
//                           (wp) =>
//                             wp.delivery_id === assignment.delivery.delivery_id
//                         );

//                       if (!waypoint) return null;

//                       const markerId = `marker-${assignment.delivery.delivery_id}`;

//                       return (
//                         <React.Fragment key={assignment.delivery.delivery_id}>
//                           <Marker
//                             position={{ lat: waypoint.lat, lng: waypoint.lng }}
//                             title={`${assignment.sequence_number}. ${assignment.delivery.customer.name}`}
//                             icon={{
//                               url: createMarkerIcon(
//                                 assignment.sequence_number,
//                                 assignment.delivery.priority
//                               ),
//                               scaledSize: new google.maps.Size(40, 40),
//                               anchor: new google.maps.Point(20, 20),
//                             }}
//                             onClick={() => {
//                               setSelectedMarker(
//                                 selectedMarker === markerId ? null : markerId
//                               );
//                             }}
//                           />

//                           {/* Info Window */}
//                           {selectedMarker === markerId && (
//                             <InfoWindow
//                               position={{
//                                 lat: waypoint.lat,
//                                 lng: waypoint.lng,
//                               }}
//                               onCloseClick={() => setSelectedMarker(null)}
//                             >
//                               <div className="p-2 min-w-[200px]">
//                                 <h3 className="font-bold text-sm mb-2">
//                                   Stop {assignment.sequence_number}:{" "}
//                                   {assignment.delivery.customer.name}
//                                 </h3>
//                                 <div className="space-y-1 text-xs">
//                                   <p>
//                                     <strong>Address:</strong>{" "}
//                                     {assignment.delivery.dropoff_location}
//                                   </p>
//                                   <p>
//                                     <strong>Phone:</strong>{" "}
//                                     {assignment.delivery.customer.phone}
//                                   </p>
//                                   <p>
//                                     <strong>ETA:</strong>{" "}
//                                     {new Date(
//                                       assignment.estimated_arrival
//                                     ).toLocaleTimeString()}
//                                   </p>
//                                   <p>
//                                     <strong>Priority:</strong>{" "}
//                                     {assignment.delivery.priority}
//                                   </p>
//                                 </div>
//                               </div>
//                             </InfoWindow>
//                           )}
//                         </React.Fragment>
//                       );
//                     })}
//                   </Map>
//                 </APIProvider>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Delivery Stops List */}
//       {selectedRoute && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Delivery Stops</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {selectedRoute.Assignment.sort(
//                 (a, b) => a.sequence_number - b.sequence_number
//               ).map((assignment) => (
//                 <div
//                   key={assignment.delivery.delivery_id}
//                   className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50"
//                 >
//                   <div className="flex-shrink-0">
//                     <div
//                       className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
//                       style={{
//                         backgroundColor: getPriorityColor(
//                           assignment.delivery.priority
//                         ),
//                       }}
//                     >
//                       {assignment.sequence_number}
//                     </div>
//                   </div>

//                   <div className="flex-1 space-y-1">
//                     <div className="flex items-center gap-2">
//                       <User className="w-4 h-4 text-gray-500" />
//                       <span className="font-medium">
//                         {assignment.delivery.customer.name}
//                       </span>
//                       <Badge
//                         variant={
//                           assignment.delivery.priority === 1
//                             ? "destructive"
//                             : assignment.delivery.priority === 2
//                             ? "default"
//                             : "secondary"
//                         }
//                       >
//                         Priority {assignment.delivery.priority}
//                       </Badge>
//                     </div>

//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <MapPin className="w-4 h-4" />
//                       <span>{assignment.delivery.dropoff_location}</span>
//                     </div>

//                     <div className="flex items-center gap-4 text-sm text-gray-600">
//                       <div className="flex items-center gap-1">
//                         <Phone className="w-4 h-4" />
//                         <span>{assignment.delivery.customer.phone}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Clock className="w-4 h-4" />
//                         <span>
//                           ETA:{" "}
//                           {new Date(
//                             assignment.estimated_arrival
//                           ).toLocaleTimeString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {routes.length === 0 && !isLoading && (
//         <Card>
//           <CardContent className="text-center py-8">
//             <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-600">
//               No routes found for this driver on {date}
//             </p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// // components/RouteVisualization.tsx
// import React, { useState, useEffect, useCallback } from "react";
// import { 
//   APIProvider, 
//   Map, 
//   Marker, 
//   InfoWindow,
//   useMap
// } from "@vis.gl/react-google-maps";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { MapPin, Navigation, Clock, User, Phone } from "lucide-react";
// import { getRouteByDriverIdAndDate } from "@/lib/clientSideDataServices";

// interface RouteWaypoint {
//   lat: number;
//   lng: number;
//   address: string;
//   delivery_id?: string;
// }

// interface RouteDelivery {
//   delivery_id: string;
//   sequence: number;
//   estimated_arrival: string;
//   travel_time_from_previous: number;
// }

// interface RouteData {
//   route_id: string;
//   driver_id: string;
//   route_details: {
//     driver_id: string;
//     driver_name: string;
//     deliveries: RouteDelivery[];
//     route_geometry: {
//       waypoints: RouteWaypoint[];
//       encoded_polyline?: string;
//       total_distance: number;
//       total_duration: number;
//     };
//     total_deliveries: number;
//     start_time: string;
//     estimated_end_time: string;
//   };
//   Assignment: Array<{
//     delivery: {
//       delivery_id: string;
//       dropoff_location: string;
//       priority: number;
//       customer: {
//         name: string;
//         phone: string;
//         address: string;
//       };
//     };
//     sequence_number: number;
//     estimated_arrival: string;
//   }>;
// }

// interface RouteVisualizationProps {
//   driverId: string;
//   date: string;
//   onRouteSelect?: (routeId: string) => void;
// }

// // Component for handling directions
// const DirectionsComponent: React.FC<{ route: RouteData }> = ({ route }) => {
//   const map = useMap();
//   const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

//   const calculateDirections = useCallback(() => {
//     if (!map || !route.route_details.route_geometry.waypoints.length) return;

//     const waypoints = route.route_details.route_geometry.waypoints;
//     if (waypoints.length < 2) {
//       console.warn("Not enough waypoints for directions");
//       return;
//     }

//     // Create directions renderer if it doesn't exist
//     if (!directionsRenderer) {
//       const renderer = new google.maps.DirectionsRenderer({
//         suppressMarkers: true, // We'll show custom markers instead
//         polylineOptions: {
//           strokeColor: "#4285f4",
//           strokeWeight: 4,
//           strokeOpacity: 0.8,
//         },
//       });
//       renderer.setMap(map);
//       setDirectionsRenderer(renderer);
//     }

//     const origin = waypoints[0];
//     const destination = waypoints[waypoints.length - 1];
    
//     // Limit waypoints to avoid API limits (max 25 waypoints for free tier)
//     const intermediateWaypoints = waypoints.slice(1, -1);
//     const limitedWaypoints = intermediateWaypoints.slice(0, 23); // Leave room for origin and destination
    
//     const waypointsForDirections = limitedWaypoints.map((wp) => ({
//       location: new google.maps.LatLng(wp.lat, wp.lng),
//       stopover: true,
//     }));

//     const directionsService = new google.maps.DirectionsService();
    
//     // Add some delay to avoid rate limiting
//     setTimeout(() => {
//       directionsService.route(
//         {
//           origin: new google.maps.LatLng(origin.lat, origin.lng),
//           destination: new google.maps.LatLng(destination.lat, destination.lng),
//           waypoints: waypointsForDirections,
//           optimizeWaypoints: false,
//           travelMode: google.maps.TravelMode.DRIVING,
//           unitSystem: google.maps.UnitSystem.METRIC,
//           avoidHighways: false,
//           avoidTolls: false,
//         },
//         (result, status) => {
//           if (status === google.maps.DirectionsStatus.OK && result && directionsRenderer) {
//             directionsRenderer.setDirections(result);
//           } else {
//             console.error("Directions request failed:", status, result);
            
//             // If directions fail, try a simpler approach with just origin and destination
//             if (waypointsForDirections.length > 0) {
//               console.log("Retrying with simplified route (origin to destination only)");
//               directionsService.route(
//                 {
//                   origin: new google.maps.LatLng(origin.lat, origin.lng),
//                   destination: new google.maps.LatLng(destination.lat, destination.lng),
//                   waypoints: [], // No intermediate waypoints
//                   travelMode: google.maps.TravelMode.DRIVING,
//                   unitSystem: google.maps.UnitSystem.METRIC,
//                 },
//                 (retryResult, retryStatus) => {
//                   if (retryStatus === google.maps.DirectionsStatus.OK && retryResult && directionsRenderer) {
//                     directionsRenderer.setDirections(retryResult);
//                     console.log("Simplified route rendered successfully");
//                   } else {
//                     console.error("Retry also failed:", retryStatus);
//                   }
//                 }
//               );
//             }
//           }
//         }
//       );
//     }, 100); // Small delay to help with rate limiting
//   }, [map, route, directionsRenderer]);

//   useEffect(() => {
//     if (map && route) {
//       const timer = setTimeout(() => {
//         calculateDirections();
//       }, 500); // Delay to ensure map is fully loaded

//       return () => clearTimeout(timer);
//     }
//   }, [calculateDirections, map, route]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (directionsRenderer) {
//         directionsRenderer.setMap(null);
//       }
//     };
//   }, [directionsRenderer]);

//   return null; // This component doesn't render anything directly
// };

// // Main component
// export const RouteVisualization: React.FC<RouteVisualizationProps> = ({
//   driverId,
//   date,
//   onRouteSelect,
// }) => {
//   const [routes, setRoutes] = useState<RouteData[]>([]);
//   const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFetching, setIsFetching] = useState(false);
//   const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

//   // Default center (Manipal coordinates)
//   const defaultCenter = { lat: 13.3479, lng: 74.7824 };

//   // Fetch routes when component mounts or dependencies change
//   useEffect(() => {
//     if (driverId && date) {
//       fetchRoutes();
//     }
//   }, [driverId, date]);

//   const fetchRoutes = async () => {
//     if (isFetching) {
//       console.log("Already fetching, skipping...");
//       return;
//     }
//     setIsLoading(true);
//     setIsFetching(true);
//     try {
//       const response = await getRouteByDriverIdAndDate(driverId, date);
//       if (response.status < 200 || response.status >= 300) {
//         throw new Error("Failed to fetch routes");
//       }

//       const apiResponse = response.data;
//       const routesData = apiResponse.data || [];

//       console.log("API Response:", apiResponse);
//       console.log("Routes Data:", routesData);

//       setRoutes(routesData);
//       if (routesData.length > 0) {
//         setSelectedRoute(routesData[0]);
//       }
//     } catch (error) {
//       console.error("Error fetching routes:", error);
//     } finally {
//       setIsLoading(false);
//       setIsFetching(false);
//     }
//   };

//   const getPriorityColor = (priority: number) => {
//     switch (priority) {
//       case 1:
//         return "#ef4444"; // red for high priority
//       case 2:
//         return "#f59e0b"; // amber for medium priority
//       case 3:
//         return "#10b981"; // green for low priority
//       default:
//         return "#6b7280"; // gray for default
//     }
//   };

//   const formatDuration = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours}h ${minutes}m`;
//   };

//   const formatDistance = (meters: number) => {
//     const km = meters / 1000;
//     return `${km.toFixed(1)} km`;
//   };

//   // Create custom marker icon
//   const createMarkerIcon = (sequenceNumber: number, priority: number) => {
//     const svg = `
//       <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
//         <circle cx="20" cy="20" r="18" fill="${getPriorityColor(priority)}" stroke="white" stroke-width="3"/>
//         <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
//           ${sequenceNumber}
//         </text>
//       </svg>
//     `;
//     return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2">Loading routes...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Route Selection */}
//       {routes.length > 1 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Available Routes</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex gap-2 flex-wrap">
//               {routes.map((route, index) => (
//                 <Button
//                   key={route.route_id}
//                   variant={
//                     selectedRoute?.route_id === route.route_id
//                       ? "default"
//                       : "outline"
//                   }
//                   onClick={() => {
//                     setSelectedRoute(route);
//                     onRouteSelect?.(route.route_id);
//                   }}
//                   className="text-sm"
//                 >
//                   Route {index + 1} ({route.route_details.total_deliveries}{" "}
//                   stops)
//                 </Button>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Route Details */}
//       {selectedRoute && (
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//           {/* Route Info */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Navigation className="w-5 h-5" />
//                 Route Overview
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Driver:</span>
//                   <span className="font-medium">
//                     {selectedRoute.route_details.driver_name}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Deliveries:</span>
//                   <span className="font-medium">
//                     {selectedRoute.route_details.total_deliveries}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Distance:</span>
//                   <span className="font-medium">
//                     {formatDistance(
//                       selectedRoute.route_details.route_geometry.total_distance
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Duration:</span>
//                   <span className="font-medium">
//                     {formatDuration(
//                       selectedRoute.route_details.route_geometry.total_duration
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Start Time:</span>
//                   <span className="font-medium">
//                     {new Date(
//                       selectedRoute.route_details.start_time
//                     ).toLocaleTimeString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Est. End:</span>
//                   <span className="font-medium">
//                     {new Date(
//                       selectedRoute.route_details.estimated_end_time
//                     ).toLocaleTimeString()}
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Map */}
//           <Card className="xl:col-span-2">
//             <CardHeader>
//               <CardTitle>Route Map</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="w-full h-96 rounded-lg border overflow-hidden">
//                 <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
//                   <Map
//                     style={{ width: "100%", height: "100%" }}
//                     defaultCenter={defaultCenter}
//                     defaultZoom={12}
//                     gestureHandling="greedy"
//                     disableDefaultUI={false}
//                   >
//                     {/* Directions */}
//                     {selectedRoute && (
//                       <DirectionsComponent route={selectedRoute} />
//                     )}

//                     {/* Delivery Markers */}
//                     {selectedRoute?.Assignment.map((assignment) => {
//                       const waypoint = selectedRoute.route_details.route_geometry.waypoints.find(
//                         (wp) => wp.delivery_id === assignment.delivery.delivery_id
//                       );

//                       if (!waypoint) return null;

//                       const markerId = `marker-${assignment.delivery.delivery_id}`;

//                       return (
//                         <React.Fragment key={assignment.delivery.delivery_id}>
//                           <Marker
//                             position={{ lat: waypoint.lat, lng: waypoint.lng }}
//                             title={`${assignment.sequence_number}. ${assignment.delivery.customer.name}`}
//                             icon={{
//                               url: createMarkerIcon(
//                                 assignment.sequence_number,
//                                 assignment.delivery.priority
//                               ),
//                               scaledSize: new google.maps.Size(40, 40),
//                               anchor: new google.maps.Point(20, 20),
//                             }}
//                             onClick={() => {
//                               setSelectedMarker(
//                                 selectedMarker === markerId ? null : markerId
//                               );
//                             }}
//                           />

//                           {/* Info Window */}
//                           {selectedMarker === markerId && (
//                             <InfoWindow
//                               position={{ lat: waypoint.lat, lng: waypoint.lng }}
//                               onCloseClick={() => setSelectedMarker(null)}
//                             >
//                               <div className="p-2 min-w-[200px]">
//                                 <h3 className="font-bold text-sm mb-2">
//                                   Stop {assignment.sequence_number}: {assignment.delivery.customer.name}
//                                 </h3>
//                                 <div className="space-y-1 text-xs">
//                                   <p>
//                                     <strong>Address:</strong> {assignment.delivery.dropoff_location}
//                                   </p>
//                                   <p>
//                                     <strong>Phone:</strong> {assignment.delivery.customer.phone}
//                                   </p>
//                                   <p>
//                                     <strong>ETA:</strong>{" "}
//                                     {new Date(assignment.estimated_arrival).toLocaleTimeString()}
//                                   </p>
//                                   <p>
//                                     <strong>Priority:</strong> {assignment.delivery.priority}
//                                   </p>
//                                 </div>
//                               </div>
//                             </InfoWindow>
//                           )}
//                         </React.Fragment>
//                       );
//                     })}
//                   </Map>
//                 </APIProvider>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Delivery Stops List */}
//       {selectedRoute && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Delivery Stops</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {selectedRoute.Assignment.sort(
//                 (a, b) => a.sequence_number - b.sequence_number
//               ).map((assignment) => (
//                 <div
//                   key={assignment.delivery.delivery_id}
//                   className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50"
//                 >
//                   <div className="flex-shrink-0">
//                     <div
//                       className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
//                       style={{
//                         backgroundColor: getPriorityColor(
//                           assignment.delivery.priority
//                         ),
//                       }}
//                     >
//                       {assignment.sequence_number}
//                     </div>
//                   </div>

//                   <div className="flex-1 space-y-1">
//                     <div className="flex items-center gap-2">
//                       <User className="w-4 h-4 text-gray-500" />
//                       <span className="font-medium">
//                         {assignment.delivery.customer.name}
//                       </span>
//                       <Badge
//                         variant={
//                           assignment.delivery.priority === 1
//                             ? "destructive"
//                             : assignment.delivery.priority === 2
//                             ? "default"
//                             : "secondary"
//                         }
//                       >
//                         Priority {assignment.delivery.priority}
//                       </Badge>
//                     </div>

//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <MapPin className="w-4 h-4" />
//                       <span>{assignment.delivery.dropoff_location}</span>
//                     </div>

//                     <div className="flex items-center gap-4 text-sm text-gray-600">
//                       <div className="flex items-center gap-1">
//                         <Phone className="w-4 h-4" />
//                         <span>{assignment.delivery.customer.phone}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Clock className="w-4 h-4" />
//                         <span>
//                           ETA:{" "}
//                           {new Date(
//                             assignment.estimated_arrival
//                           ).toLocaleTimeString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {routes.length === 0 && !isLoading && (
//         <Card>
//           <CardContent className="text-center py-8">
//             <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-600">
//               No routes found for this driver on {date}
//             </p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };


/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// // components/RouteVisualization.tsx
// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { MapPin, Navigation, Clock, User, Phone, RefreshCw } from "lucide-react";
// import { getRouteByDriverIdAndDate } from "@/lib/clientSideDataServices";

// interface RouteWaypoint {
//   lat: number;
//   lng: number;
//   address: string;
//   delivery_id?: string;
// }

// interface RouteDelivery {
//   delivery_id: string;
//   sequence: number;
//   estimated_arrival: string;
//   travel_time_from_previous: number;
// }

// interface RouteData {
//   route_id: string;
//   driver_id: string;
//   route_details: {
//     driver_id: string;
//     driver_name: string;
//     deliveries: RouteDelivery[];
//     route_geometry: {
//       waypoints: RouteWaypoint[];
//       encoded_polyline?: string;
//       total_distance: number;
//       total_duration: number;
//     };
//     total_deliveries: number;
//     start_time: string;
//     estimated_end_time: string;
//   };
//   Assignment: Array<{
//     delivery: {
//       delivery_id: string;
//       dropoff_location: string;
//       priority: number;
//       customer: {
//         name: string;
//         phone: string;
//         address: string;
//       };
//     };
//     sequence_number: number;
//     estimated_arrival: string;
//   }>;
// }

// interface RouteVisualizationProps {
//   driverId: string;
//   date: string;
//   onRouteSelect?: (routeId: string) => void;
// }

// // Main component
// export const RouteVisualization: React.FC<RouteVisualizationProps> = ({
//   driverId,
//   date,
//   onRouteSelect,
// }) => {
//   const [routes, setRoutes] = useState<RouteData[]>([]);
//   const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFetching, setIsFetching] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch routes when component mounts or dependencies change
//   useEffect(() => {
//     if (driverId && date) {
//       fetchRoutes();
//     }
//   }, [driverId, date]);

//   const fetchRoutes = async () => {
//     if (isFetching) {
//       console.log("Already fetching, skipping...");
//       return;
//     }
    
//     setIsLoading(true);
//     setIsFetching(true);
//     setError(null);
    
//     try {
//       const response = await getRouteByDriverIdAndDate(driverId, date);
//       if (response.status < 200 || response.status >= 300) {
//         throw new Error(`Failed to fetch routes: ${response.status}`);
//       }

//       const apiResponse = response.data;
//       const routesData = apiResponse.data || [];

//       console.log("API Response:", apiResponse);
//       console.log("Routes Data:", routesData);

//       setRoutes(routesData);
//       if (routesData.length > 0) {
//         setSelectedRoute(routesData[0]);
//         onRouteSelect?.(routesData[0].route_id);
//       } else {
//         setSelectedRoute(null);
//       }
//     } catch (error) {
//       console.error("Error fetching routes:", error);
//       setError(error instanceof Error ? error.message : "Failed to fetch routes");
//     } finally {
//       setIsLoading(false);
//       setIsFetching(false);
//     }
//   };

//   const getPriorityColor = (priority: number) => {
//     switch (priority) {
//       case 1:
//         return "#ef4444"; // red for high priority
//       case 2:
//         return "#f59e0b"; // amber for medium priority
//       case 3:
//         return "#10b981"; // green for low priority
//       default:
//         return "#6b7280"; // gray for default
//     }
//   };

//   const getPriorityLabel = (priority: number) => {
//     switch (priority) {
//       case 1:
//         return "High";
//       case 2:
//         return "Medium";
//       case 3:
//         return "Low";
//       default:
//         return "Normal";
//     }
//   };

//   const formatDuration = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     if (hours > 0) {
//       return `${hours}h ${minutes}m`;
//     }
//     return `${minutes}m`;
//   };

//   const formatDistance = (meters: number) => {
//     const km = meters / 1000;
//     return `${km.toFixed(1)} km`;
//   };

//   // Generate Google Maps Embed URL for directions
//   const generateMapUrl = (route: RouteData) => {
//     const waypoints = route.route_details.route_geometry.waypoints;
    
//     if (waypoints.length < 2) {
//       return "";
//     }

//     const origin = waypoints[0];
//     const destination = waypoints[waypoints.length - 1];
//     const intermediateWaypoints = waypoints.slice(1, -1);

//     // Build the embed URL
//     let url = `https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    
//     // Use coordinates for more accuracy
//     url += `&origin=${origin.lat},${origin.lng}`;
//     url += `&destination=${destination.lat},${destination.lng}`;
    
//     // Add waypoints if any (limit to avoid URL length issues)
//     if (intermediateWaypoints.length > 0) {
//       const waypointCoords = intermediateWaypoints
//         .slice(0, 20) // Limit waypoints to avoid URL length issues
//         .map(wp => `${wp.lat},${wp.lng}`)
//         .join("|");
//       url += `&waypoints=${waypointCoords}`;
//     }
    
//     // Additional parameters
//     url += `&mode=driving`;
//     url += `&units=metric`;
//     url += `&zoom=12`;

//     return url;
//   };

//   const handleRefresh = () => {
//     fetchRoutes();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2">Loading routes...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Card>
//         <CardContent className="text-center py-8">
//           <div className="text-red-500 mb-4">
//             <Navigation className="w-12 h-12 mx-auto mb-2" />
//             <p className="text-lg font-medium">Error Loading Routes</p>
//             <p className="text-sm">{error}</p>
//           </div>
//           <Button onClick={handleRefresh} variant="outline">
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Try Again
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with refresh button */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Route Visualization</h2>
//         <Button onClick={handleRefresh} variant="outline" size="sm">
//           <RefreshCw className="w-4 h-4 mr-2" />
//           Refresh
//         </Button>
//       </div>

//       {/* Route Selection */}
//       {routes.length > 1 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Available Routes</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex gap-2 flex-wrap">
//               {routes.map((route, index) => (
//                 <Button
//                   key={route.route_id}
//                   variant={
//                     selectedRoute?.route_id === route.route_id
//                       ? "default"
//                       : "outline"
//                   }
//                   onClick={() => {
//                     setSelectedRoute(route);
//                     onRouteSelect?.(route.route_id);
//                   }}
//                   className="text-sm"
//                 >
//                   Route {index + 1} ({route.route_details.total_deliveries}{" "}
//                   stops)
//                 </Button>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Route Details */}
//       {selectedRoute && (
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//           {/* Route Info */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Navigation className="w-5 h-5" />
//                 Route Overview
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Driver:</span>
//                   <span className="font-medium">
//                     {selectedRoute.route_details.driver_name}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Deliveries:</span>
//                   <Badge variant="secondary">
//                     {selectedRoute.route_details.total_deliveries} stops
//                   </Badge>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Distance:</span>
//                   <span className="font-medium">
//                     {formatDistance(
//                       selectedRoute.route_details.route_geometry.total_distance
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Duration:</span>
//                   <span className="font-medium">
//                     {formatDuration(
//                       selectedRoute.route_details.route_geometry.total_duration
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Start Time:</span>
//                   <span className="font-medium">
//                     {new Date(
//                       selectedRoute.route_details.start_time
//                     ).toLocaleTimeString([], { 
//                       hour: '2-digit', 
//                       minute: '2-digit' 
//                     })}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Est. End:</span>
//                   <span className="font-medium">
//                     {new Date(
//                       selectedRoute.route_details.estimated_end_time
//                     ).toLocaleTimeString([], { 
//                       hour: '2-digit', 
//                       minute: '2-digit' 
//                     })}
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Map */}
//           <Card className="xl:col-span-2">
//             <CardHeader>
//               <CardTitle>Route Map</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="w-full h-96 rounded-lg border overflow-hidden">
//                 {selectedRoute && generateMapUrl(selectedRoute) ? (
//                   <iframe
//                     width="100%"
//                     height="100%"
//                     frameBorder="0"
//                     style={{ border: 0 }}
//                     src={generateMapUrl(selectedRoute)}
//                     allowFullScreen
//                     loading="lazy"
//                     referrerPolicy="no-referrer-when-downgrade"
//                     title={`Route for ${selectedRoute.route_details.driver_name}`}
//                   />
//                 ) : (
//                   <div className="flex items-center justify-center h-full bg-gray-50">
//                     <div className="text-center">
//                       <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
//                       <p className="text-gray-600">Map unavailable</p>
//                       <p className="text-sm text-gray-500">
//                         Check Google Maps API configuration
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Delivery Stops List */}
//       {selectedRoute && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center justify-between">
//               <span>Delivery Stops</span>
//               <Badge variant="outline">
//                 {selectedRoute.Assignment.length} deliveries
//               </Badge>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {selectedRoute.Assignment.sort(
//                 (a, b) => a.sequence_number - b.sequence_number
//               ).map((assignment, index) => (
//                 <div
//                   key={assignment.delivery.delivery_id}
//                   className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex-shrink-0">
//                     <div
//                       className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
//                       style={{
//                         backgroundColor: getPriorityColor(
//                           assignment.delivery.priority
//                         ),
//                       }}
//                     >
//                       {assignment.sequence_number}
//                     </div>
//                   </div>

//                   <div className="flex-1 space-y-2">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <div className="flex items-center gap-2">
//                         <User className="w-4 h-4 text-gray-500" />
//                         <span className="font-medium">
//                           {assignment.delivery.customer.name}
//                         </span>
//                       </div>
//                       <Badge
//                         variant={
//                           assignment.delivery.priority === 1
//                             ? "destructive"
//                             : assignment.delivery.priority === 2
//                             ? "default"
//                             : "secondary"
//                         }
//                       >
//                         {getPriorityLabel(assignment.delivery.priority)} Priority
//                       </Badge>
//                     </div>

//                     <div className="flex items-start gap-2 text-sm text-gray-600">
//                       <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                       <span className="break-words">
//                         {assignment.delivery.dropoff_location}
//                       </span>
//                     </div>

//                     <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
//                       <div className="flex items-center gap-1">
//                         <Phone className="w-4 h-4" />
//                         <span>{assignment.delivery.customer.phone}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Clock className="w-4 h-4" />
//                         <span>
//                           ETA:{" "}
//                           {new Date(
//                             assignment.estimated_arrival
//                           ).toLocaleTimeString([], { 
//                             hour: '2-digit', 
//                             minute: '2-digit' 
//                           })}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* No routes found */}
//       {routes.length === 0 && !isLoading && (
//         <Card>
//           <CardContent className="text-center py-12">
//             <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No Routes Found
//             </h3>
//             <p className="text-gray-600 mb-4">
//               No routes found for this driver on {new Date(date).toLocaleDateString()}
//             </p>
//             <Button onClick={handleRefresh} variant="outline">
//               <RefreshCw className="w-4 h-4 mr-2" />
//               Refresh
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// "use client";
// // components/RouteVisualization.tsx
// import React, { useState, useEffect, useRef } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { MapPin, Navigation, Clock, User, Phone, RefreshCw } from "lucide-react";
// import { getRouteByDriverIdAndDate } from "@/lib/clientSideDataServices";

// // Google Maps types
// declare global {
//   interface Window {
//     google: any;
//     initMap: () => void;
//   }
// }

// interface RouteWaypoint {
//   lat: number;
//   lng: number;
//   address: string;
//   delivery_id?: string;
// }

// interface RouteDelivery {
//   delivery_id: string;
//   sequence: number;
//   estimated_arrival: string;
//   travel_time_from_previous: number;
// }

// interface RouteData {
//   route_id: string;
//   driver_id: string;
//   route_details: {
//     driver_id: string;
//     driver_name: string;
//     deliveries: RouteDelivery[];
//     route_geometry: {
//       waypoints: RouteWaypoint[];
//       encoded_polyline?: string;
//       total_distance: number;
//       total_duration: number;
//     };
//     total_deliveries: number;
//     start_time: string;
//     estimated_end_time: string;
//   };
//   Assignment: Array<{
//     delivery: {
//       delivery_id: string;
//       dropoff_location: string;
//       priority: number;
//       customer: {
//         name: string;
//         phone: string;
//         address: string;
//       };
//     };
//     sequence_number: number;
//     estimated_arrival: string;
//   }>;
// }

// interface RouteVisualizationProps {
//   driverId: string;
//   date: string;
//   onRouteSelect?: (routeId: string) => void;
// }

// // Google Maps Component
// const GoogleMap: React.FC<{
//   route: RouteData;
//   onMapLoad?: (map: any) => void;
// }> = ({ route, onMapLoad }) => {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapInstanceRef = useRef<any>(null);
//   const directionsServiceRef = useRef<any>(null);
//   const directionsRendererRef = useRef<any>(null);
//   const markersRef = useRef<any[]>([]);

//   useEffect(() => {
//     // Load Google Maps script if not already loaded
//     if (!window.google) {
//       const script = document.createElement('script');
//       script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
//       script.async = true;
//       script.defer = true;
//       script.onload = initializeMap;
//       document.head.appendChild(script);
//     } else {
//       initializeMap();
//     }

//     return () => {
//       // Cleanup markers and directions renderer
//       clearMarkersAndDirections();
//     };
//   }, [route]);

//   const clearMarkersAndDirections = () => {
//     // Clear existing markers
//     markersRef.current.forEach(marker => marker.setMap(null));
//     markersRef.current = [];

//     // Clear existing directions
//     if (directionsRendererRef.current) {
//       directionsRendererRef.current.setMap(null);
//     }
//   };

//   const initializeMap = () => {
//     if (!mapRef.current || !window.google) return;

//     const waypoints = route.route_details.route_geometry.waypoints;
//     if (waypoints.length === 0) return;

//     // Initialize map
//     const map = new window.google.maps.Map(mapRef.current, {
//       zoom: 12,
//       center: { lat: waypoints[0].lat, lng: waypoints[0].lng },
//       mapTypeId: window.google.maps.MapTypeId.ROADMAP,
//     });

//     mapInstanceRef.current = map;
//     onMapLoad?.(map);

//     // Initialize directions service and renderer
//     directionsServiceRef.current = new window.google.maps.DirectionsService();
//     directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
//       suppressMarkers: true, // We'll create custom markers
//       polylineOptions: {
//         strokeColor: '#2563eb',
//         strokeWeight: 4,
//         strokeOpacity: 0.8,
//       },
//     });

//     directionsRendererRef.current.setMap(map);

//     // Calculate and display route
//     calculateRoute(map);
//   };

//   const calculateRoute = (map: any) => {
//     const waypoints = route.route_details.route_geometry.waypoints;
//     if (waypoints.length < 2) return;

//     const origin = waypoints[0];
//     const destination = waypoints[waypoints.length - 1];
//     const waypointsForDirections = waypoints.slice(1, -1).map(wp => ({
//       location: { lat: wp.lat, lng: wp.lng },
//       stopover: true,
//     }));

//     const request = {
//       origin: { lat: origin.lat, lng: origin.lng },
//       destination: { lat: destination.lat, lng: destination.lng },
//       waypoints: waypointsForDirections,
//       optimizeWaypoints: false, // Keep original sequence
//       travelMode: window.google.maps.TravelMode.DRIVING,
//       unitSystem: window.google.maps.UnitSystem.METRIC,
//       avoidHighways: false,
//       avoidTolls: false,
//     };

//     directionsServiceRef.current.route(request, (result: any, status: any) => {
//       if (status === window.google.maps.DirectionsStatus.OK) {
//         directionsRendererRef.current.setDirections(result);
        
//         // Create custom markers for each delivery
//         createDeliveryMarkers(map);
//       } else {
//         console.error('Directions request failed due to ' + status);
//         // Fallback: create markers without route
//         createDeliveryMarkers(map);
//       }
//     });
//   };

//   const createDeliveryMarkers = (map: any) => {
//     clearMarkersAndDirections();

//     const assignments = route.Assignment.sort((a, b) => a.sequence_number - b.sequence_number);
//     const waypoints = route.route_details.route_geometry.waypoints;

//     assignments.forEach((assignment, index) => {
//       const waypoint = waypoints.find(wp => wp.delivery_id === assignment.delivery.delivery_id) 
//         || waypoints[index]; // Fallback to index-based waypoint

//       if (!waypoint) return;

//       const markerColor = getPriorityColor(assignment.delivery.priority);
      
//       // Create custom marker with sequence number
//       const marker = new window.google.maps.Marker({
//         position: { lat: waypoint.lat, lng: waypoint.lng },
//         map: map,
//         title: `Stop ${assignment.sequence_number}: ${assignment.delivery.customer.name}`,
//         label: {
//           text: assignment.sequence_number.toString(),
//           color: 'white',
//           fontWeight: 'bold',
//           fontSize: '12px',
//         },
//         icon: {
//           path: window.google.maps.SymbolPath.CIRCLE,
//           fillColor: markerColor,
//           fillOpacity: 1,
//           strokeColor: '#ffffff',
//           strokeWeight: 2,
//           scale: 15,
//         },
//       });

//       // Create info window
//       const infoWindow = new window.google.maps.InfoWindow({
//         content: `
//           <div style="padding: 8px; max-width: 300px;">
//             <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
//               Stop ${assignment.sequence_number}: ${assignment.delivery.customer.name}
//             </h4>
//             <div style="margin-bottom: 6px;">
//               <strong style="color: #6b7280; font-size: 12px;">Address:</strong>
//               <div style="color: #374151; font-size: 12px;">${assignment.delivery.dropoff_location}</div>
//             </div>
//             <div style="margin-bottom: 6px;">
//               <strong style="color: #6b7280; font-size: 12px;">Phone:</strong>
//               <span style="color: #374151; font-size: 12px;">${assignment.delivery.customer.phone}</span>
//             </div>
//             <div style="margin-bottom: 6px;">
//               <strong style="color: #6b7280; font-size: 12px;">Priority:</strong>
//               <span style="color: ${markerColor}; font-size: 12px; font-weight: 600;">
//                 ${getPriorityLabel(assignment.delivery.priority)}
//               </span>
//             </div>
//             <div>
//               <strong style="color: #6b7280; font-size: 12px;">ETA:</strong>
//               <span style="color: #374151; font-size: 12px;">
//                 ${new Date(assignment.estimated_arrival).toLocaleTimeString([], { 
//                   hour: '2-digit', 
//                   minute: '2-digit' 
//                 })}
//               </span>
//             </div>
//           </div>
//         `,
//       });

//       marker.addListener('click', () => {
//         // Close all other info windows
//         markersRef.current.forEach(m => m.infoWindow?.close());
//         infoWindow.open(map, marker);
//       });

//       // Store reference to info window
//       (marker as any).infoWindow = infoWindow;
//       markersRef.current.push(marker);
//     });

//     // Fit map to show all markers
//     if (markersRef.current.length > 0) {
//       const bounds = new window.google.maps.LatLngBounds();
//       markersRef.current.forEach(marker => {
//         bounds.extend(marker.getPosition());
//       });
//       map.fitBounds(bounds);
      
//       // Ensure minimum zoom level
//       const listener = window.google.maps.event.addListener(map, 'idle', () => {
//         if (map.getZoom() > 15) map.setZoom(15);
//         window.google.maps.event.removeListener(listener);
//       });
//     }
//   };

//   const getPriorityColor = (priority: number) => {
//     switch (priority) {
//       case 1: return '#ef4444'; // red for high priority
//       case 2: return '#f59e0b'; // amber for medium priority
//       case 3: return '#10b981'; // green for low priority
//       default: return '#6b7280'; // gray for default
//     }
//   };

//   const getPriorityLabel = (priority: number) => {
//     switch (priority) {
//       case 1: return 'High';
//       case 2: return 'Medium';
//       case 3: return 'Low';
//       default: return 'Normal';
//     }
//   };

//   return (
//     <div 
//       ref={mapRef} 
//       className="w-full h-96 rounded-lg border"
//       style={{ minHeight: '400px' }}
//     />
//   );
// };

// // Main component
// export const RouteVisualization: React.FC<RouteVisualizationProps> = ({
//   driverId,
//   date,
//   onRouteSelect,
// }) => {
//   const [routes, setRoutes] = useState<RouteData[]>([]);
//   const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFetching, setIsFetching] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch routes when component mounts or dependencies change
//   useEffect(() => {
//     if (driverId && date) {
//       fetchRoutes();
//     }
//   }, [driverId, date]);

//   const fetchRoutes = async () => {
//     if (isFetching) {
//       console.log("Already fetching, skipping...");
//       return;
//     }
    
//     setIsLoading(true);
//     setIsFetching(true);
//     setError(null);
    
//     try {
//       const response = await getRouteByDriverIdAndDate(driverId, date);
//       if (response.status < 200 || response.status >= 300) {
//         throw new Error(`Failed to fetch routes: ${response.status}`);
//       }

//       const apiResponse = response.data;
//       const routesData = apiResponse.data || [];

//       console.log("API Response:", apiResponse);
//       console.log("Routes Data:", routesData);

//       setRoutes(routesData);
//       if (routesData.length > 0) {
//         setSelectedRoute(routesData[0]);
//         onRouteSelect?.(routesData[0].route_id);
//       } else {
//         setSelectedRoute(null);
//       }
//     } catch (error) {
//       console.error("Error fetching routes:", error);
//       setError(error instanceof Error ? error.message : "Failed to fetch routes");
//     } finally {
//       setIsLoading(false);
//       setIsFetching(false);
//     }
//   };

//   const getPriorityColor = (priority: number) => {
//     switch (priority) {
//       case 1: return "#ef4444";
//       case 2: return "#f59e0b";
//       case 3: return "#10b981";
//       default: return "#6b7280";
//     }
//   };

//   const getPriorityLabel = (priority: number) => {
//     switch (priority) {
//       case 1: return "High";
//       case 2: return "Medium";
//       case 3: return "Low";
//       default: return "Normal";
//     }
//   };

//   const formatDuration = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     if (hours > 0) {
//       return `${hours}h ${minutes}m`;
//     }
//     return `${minutes}m`;
//   };

//   const formatDistance = (meters: number) => {
//     const km = meters / 1000;
//     return `${km.toFixed(1)} km`;
//   };

//   const handleRefresh = () => {
//     fetchRoutes();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2">Loading routes...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Card>
//         <CardContent className="text-center py-8">
//           <div className="text-red-500 mb-4">
//             <Navigation className="w-12 h-12 mx-auto mb-2" />
//             <p className="text-lg font-medium">Error Loading Routes</p>
//             <p className="text-sm">{error}</p>
//           </div>
//           <Button onClick={handleRefresh} variant="outline">
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Try Again
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with refresh button */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Route Visualization</h2>
//         <Button onClick={handleRefresh} variant="outline" size="sm">
//           <RefreshCw className="w-4 h-4 mr-2" />
//           Refresh
//         </Button>
//       </div>

//       {/* Route Selection */}
//       {routes.length > 1 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Available Routes</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex gap-2 flex-wrap">
//               {routes.map((route, index) => (
//                 <Button
//                   key={route.route_id}
//                   variant={
//                     selectedRoute?.route_id === route.route_id
//                       ? "default"
//                       : "outline"
//                   }
//                   onClick={() => {
//                     setSelectedRoute(route);
//                     onRouteSelect?.(route.route_id);
//                   }}
//                   className="text-sm"
//                 >
//                   Route {index + 1} ({route.route_details.total_deliveries}{" "}
//                   stops)
//                 </Button>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Route Details */}
//       {selectedRoute && (
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//           {/* Route Info */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Navigation className="w-5 h-5" />
//                 Route Overview
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Driver:</span>
//                   <span className="font-medium">
//                     {selectedRoute.route_details.driver_name}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Deliveries:</span>
//                   <Badge variant="secondary">
//                     {selectedRoute.route_details.total_deliveries} stops
//                   </Badge>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Distance:</span>
//                   <span className="font-medium">
//                     {formatDistance(
//                       selectedRoute.route_details.route_geometry.total_distance
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Duration:</span>
//                   <span className="font-medium">
//                     {formatDuration(
//                       selectedRoute.route_details.route_geometry.total_duration
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Start Time:</span>
//                   <span className="font-medium">
//                     {new Date(
//                       selectedRoute.route_details.start_time
//                     ).toLocaleTimeString([], { 
//                       hour: '2-digit', 
//                       minute: '2-digit' 
//                     })}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Est. End:</span>
//                   <span className="font-medium">
//                     {new Date(
//                       selectedRoute.route_details.estimated_end_time
//                     ).toLocaleTimeString([], { 
//                       hour: '2-digit', 
//                       minute: '2-digit' 
//                     })}
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Interactive Map */}
//           <Card className="xl:col-span-2">
//             <CardHeader>
//               <CardTitle>Interactive Route Map</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {selectedRoute && selectedRoute.route_details.route_geometry.waypoints.length > 0 ? (
//                 <GoogleMap route={selectedRoute} />
//               ) : (
//                 <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border">
//                   <div className="text-center">
//                     <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
//                     <p className="text-gray-600">No waypoints available</p>
//                     <p className="text-sm text-gray-500">
//                       Route data incomplete
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Delivery Stops List */}
//       {selectedRoute && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center justify-between">
//               <span>Delivery Stops</span>
//               <Badge variant="outline">
//                 {selectedRoute.Assignment.length} deliveries
//               </Badge>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {selectedRoute.Assignment.sort(
//                 (a, b) => a.sequence_number - b.sequence_number
//               ).map((assignment) => (
//                 <div
//                   key={assignment.delivery.delivery_id}
//                   className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex-shrink-0">
//                     <div
//                       className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
//                       style={{
//                         backgroundColor: getPriorityColor(
//                           assignment.delivery.priority
//                         ),
//                       }}
//                     >
//                       {assignment.sequence_number}
//                     </div>
//                   </div>

//                   <div className="flex-1 space-y-2">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <div className="flex items-center gap-2">
//                         <User className="w-4 h-4 text-gray-500" />
//                         <span className="font-medium">
//                           {assignment.delivery.customer.name}
//                         </span>
//                       </div>
//                       <Badge
//                         variant={
//                           assignment.delivery.priority === 1
//                             ? "destructive"
//                             : assignment.delivery.priority === 2
//                             ? "default"
//                             : "secondary"
//                         }
//                       >
//                         {getPriorityLabel(assignment.delivery.priority)} Priority
//                       </Badge>
//                     </div>

//                     <div className="flex items-start gap-2 text-sm text-gray-600">
//                       <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                       <span className="break-words">
//                         {assignment.delivery.dropoff_location}
//                       </span>
//                     </div>

//                     <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
//                       <div className="flex items-center gap-1">
//                         <Phone className="w-4 h-4" />
//                         <span>{assignment.delivery.customer.phone}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Clock className="w-4 h-4" />
//                         <span>
//                           ETA:{" "}
//                           {new Date(
//                             assignment.estimated_arrival
//                           ).toLocaleTimeString([], { 
//                             hour: '2-digit', 
//                             minute: '2-digit' 
//                           })}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* No routes found */}
//       {routes.length === 0 && !isLoading && (
//         <Card>
//           <CardContent className="text-center py-12">
//             <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No Routes Found
//             </h3>
//             <p className="text-gray-600 mb-4">
//               No routes found for this driver on {new Date(date).toLocaleDateString()}
//             </p>
//             <Button onClick={handleRefresh} variant="outline">
//               <RefreshCw className="w-4 h-4 mr-2" />
//               Refresh
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

"use client";
// components/RouteVisualization.tsx
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Clock,
  User,
  Phone,
  RefreshCw,
} from "lucide-react";

// Mock data service function (replace with your actual implementation)
const getRouteByDriverIdAndDate = async (driverId: string, date: string) => {
  // This would be your actual API call
  return {
    status: 200,
    data: {
      data: [
        {
          route_id: "route_001",
          driver_id: driverId,
          route_details: {
            driver_id: driverId,
            driver_name: "John Doe",
            deliveries: [
              {
                delivery_id: "del_001",
                sequence: 1,
                estimated_arrival: "2025-06-03T09:00:00Z",
                travel_time_from_previous: 0,
              },
              {
                delivery_id: "del_002",
                sequence: 2,
                estimated_arrival: "2025-06-03T10:30:00Z",
                travel_time_from_previous: 1800,
              },
            ],
            route_geometry: {
              waypoints: [
                {
                  lat: 12.9716,
                  lng: 77.5946,
                  address: "123 Main St, Bangalore",
                  delivery_id: "del_001",
                },
                {
                  lat: 12.9352,
                  lng: 77.6245,
                  address: "456 Oak Ave, Bangalore",
                  delivery_id: "del_002",
                },
              ],
              total_distance: 15000,
              total_duration: 3600,
            },
            total_deliveries: 2,
            start_time: "2025-06-03T08:00:00Z",
            estimated_end_time: "2025-06-03T17:00:00Z",
          },
          Assignment: [
            {
              delivery: {
                delivery_id: "del_001",
                dropoff_location:
                  "123 Main St, Koramangala, Bangalore, Karnataka 560034",
                priority: 1,
                customer: {
                  name: "Alice Johnson",
                  phone: "+91 98765 43210",
                  address: "123 Main St, Koramangala, Bangalore",
                },
              },
              sequence_number: 1,
              estimated_arrival: "2025-06-03T09:00:00Z",
            },
            {
              delivery: {
                delivery_id: "del_002",
                dropoff_location:
                  "456 Oak Ave, Indiranagar, Bangalore, Karnataka 560038",
                priority: 2,
                customer: {
                  name: "Bob Smith",
                  phone: "+91 87654 32109",
                  address: "456 Oak Ave, Indiranagar, Bangalore",
                },
              },
              sequence_number: 2,
              estimated_arrival: "2025-06-03T10:30:00Z",
            },
          ],
        },
      ],
    },
  };
};

// Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface RouteWaypoint {
  lat: number;
  lng: number;
  address: string;
  delivery_id?: string;
}

interface RouteDelivery {
  delivery_id: string;
  sequence: number;
  estimated_arrival: string;
  travel_time_from_previous: number;
}

interface RouteData {
  route_id: string;
  driver_id: string;
  route_details: {
    driver_id: string;
    driver_name: string;
    deliveries: RouteDelivery[];
    route_geometry: {
      waypoints: RouteWaypoint[];
      encoded_polyline?: string;
      total_distance: number;
      total_duration: number;
    };
    total_deliveries: number;
    start_time: string;
    estimated_end_time: string;
  };
  Assignment: Array<{
    delivery: {
      delivery_id: string;
      dropoff_location: string;
      priority: number;
      customer: {
        name: string;
        phone: string;
        address: string;
      };
    };
    sequence_number: number;
    estimated_arrival: string;
  }>;
}

interface RouteVisualizationProps {
  driverId: string;
  date: string;
  onRouteSelect?: (routeId: string) => void;
}

interface GeocodedWaypoint {
  location: any;
  address: string;
  delivery_id: string;
  sequence: number;
  customer: any;
}

// Google Maps Component
const GoogleMap: React.FC<{
  route: RouteData;
  onMapLoad?: (map: any) => void;
}> = ({ route, onMapLoad }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const directionsServiceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // For demo purposes, use a simple map without Google Maps API
    // In production, you would load the actual Google Maps script
    initializeMap();

    return () => {
      clearMarkersAndDirections();
    };
  }, [route]);

  const clearMarkersAndDirections = () => {
    markersRef.current = [];
  };

  const initializeMap = () => {
    if (!mapRef.current) return;

    // Check if we have delivery assignments
    if (!route.Assignment || route.Assignment.length === 0) {
      console.warn("No delivery assignments found");
      return;
    }

    // For demo purposes, we'll show a placeholder map
    // In production, initialize actual Google Maps here
    console.log("Initializing map with route data:", route);
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "#ef4444"; // red for high priority
      case 2:
        return "#f59e0b"; // amber for medium priority
      case 3:
        return "#10b981"; // green for low priority
      default:
        return "#6b7280"; // gray for default
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return "High";
      case 2:
        return "Medium";
      case 3:
        return "Low";
      default:
        return "Normal";
    }
  };

  return (
    <div className="w-full h-96 rounded-lg border bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
      {/* Demo Map Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <MapPin className="w-16 h-16 text-blue-500 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Interactive Route Map
            </h3>
            <p className="text-sm text-gray-600">
              Showing {route.Assignment.length} delivery stops
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {route.Assignment.sort(
                (a, b) => a.sequence_number - b.sequence_number
              ).map((assignment) => (
                <div
                  key={assignment.delivery.delivery_id}
                  className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm border"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      backgroundColor: getPriorityColor(
                        assignment.delivery.priority
                      ),
                    }}
                  >
                    {assignment.sequence_number}
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {assignment.delivery.customer.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Route Path Visualization */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient
            id="routeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          d="M 50 100 Q 200 50 350 150 Q 500 250 650 200"
          stroke="url(#routeGradient)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="10,5"
        />
      </svg>
    </div>
  );
};

// Main component
export const RouteVisualization: React.FC<RouteVisualizationProps> = ({
  driverId,
  date,
  onRouteSelect,
}) => {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch routes when component mounts or dependencies change
  useEffect(() => {
    if (driverId && date) {
      fetchRoutes();
    }
  }, [driverId, date]);

  const fetchRoutes = async () => {
    if (isFetching) {
      console.log("Already fetching, skipping...");
      return;
    }

    setIsLoading(true);
    setIsFetching(true);
    setError(null);

    try {
      const response = await getRouteByDriverIdAndDate(driverId, date);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Failed to fetch routes: ${response.status}`);
      }

      const apiResponse = response.data;
      const routesData = apiResponse.data || [];

      console.log("API Response:", apiResponse);
      console.log("Routes Data:", routesData);

      setRoutes(routesData);
      if (routesData.length > 0) {
        setSelectedRoute(routesData[0]);
        onRouteSelect?.(routesData[0].route_id);
      } else {
        setSelectedRoute(null);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch routes"
      );
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "#ef4444";
      case 2:
        return "#f59e0b";
      case 3:
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return "High";
      case 2:
        return "Medium";
      case 3:
        return "Low";
      default:
        return "Normal";
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDistance = (meters: number) => {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  };

  const handleRefresh = () => {
    fetchRoutes();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading routes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-red-500 mb-4">
            <Navigation className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Error Loading Routes</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (routes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <Navigation className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-medium">No Routes Found</p>
            <p className="text-sm">
              No routes available for the selected driver and date.
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Route Visualization</h2>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Route Selection */}
      {routes.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {routes.map((route, index) => (
                <Button
                  key={route.route_id}
                  variant={
                    selectedRoute?.route_id === route.route_id
                      ? "default"
                      : "outline"
                  }
                  onClick={() => {
                    setSelectedRoute(route);
                    onRouteSelect?.(route.route_id);
                  }}
                  className="text-sm"
                >
                  Route {index + 1} ({route.route_details.total_deliveries}{" "}
                  stops)
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Route Details */}
      {selectedRoute && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Route Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Route Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Driver:</span>
                  <span className="font-medium">
                    {selectedRoute.route_details.driver_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Deliveries:</span>
                  <Badge variant="secondary">
                    {selectedRoute.route_details.total_deliveries} stops
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Distance:</span>
                  <span className="font-medium">
                    {formatDistance(
                      selectedRoute.route_details.route_geometry.total_distance
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {formatDuration(
                      selectedRoute.route_details.route_geometry.total_duration
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Start Time:</span>
                  <span className="font-medium">
                    {new Date(
                      selectedRoute.route_details.start_time
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Est. End:</span>
                  <span className="font-medium">
                    {new Date(
                      selectedRoute.route_details.estimated_end_time
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Map */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Interactive Route Map</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRoute && selectedRoute.Assignment.length > 0 ? (
                <GoogleMap route={selectedRoute} />
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      No delivery assignments available
                    </p>
                    <p className="text-sm text-gray-500">
                      Route data incomplete
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delivery Stops List */}
      {selectedRoute && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Delivery Stops</span>
              <Badge variant="outline">
                {selectedRoute.Assignment.length} deliveries
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedRoute.Assignment.sort(
                (a, b) => a.sequence_number - b.sequence_number
              ).map((assignment) => (
                <div
                  key={assignment.delivery.delivery_id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                      style={{
                        backgroundColor: getPriorityColor(
                          assignment.delivery.priority
                        ),
                      }}
                    >
                      {assignment.sequence_number}
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
                          {assignment.delivery.customer.name}
                        </span>
                      </div>
                      <Badge
                        variant={
                          assignment.delivery.priority === 1
                            ? "destructive"
                            : assignment.delivery.priority === 2
                            ? "default"
                            : "secondary"
                        }
                      >
                        {getPriorityLabel(assignment.delivery.priority)}{" "}
                        Priority
                      </Badge>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="break-words">
                        {assignment.delivery.dropoff_location}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{assignment.delivery.customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          ETA:{" "}
                          {new Date(
                            assignment.estimated_arrival
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Demo wrapper component
export default function RouteVisualizationDemo() {
  const [selectedDriverId, setSelectedDriverId] = useState("driver_001");
  const [selectedDate, setSelectedDate] = useState("2025-06-03");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex gap-4 items-center mb-6">
        <div>
          <label className="text-sm font-medium">Driver ID:</label>
          <input
            type="text"
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="ml-2 px-3 py-1 border rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="ml-2 px-3 py-1 border rounded"
          />
        </div>
      </div>

      <RouteVisualization
        driverId={selectedDriverId}
        date={selectedDate}
        onRouteSelect={(routeId) => console.log("Selected route:", routeId)}
      />
    </div>
  );
}