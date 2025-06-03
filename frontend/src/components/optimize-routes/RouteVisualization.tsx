/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// components/RouteVisualization.tsx
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, User, Phone } from "lucide-react";
import { getRouteByDriverIdAndDate } from "@/lib/clientSideDataServices";

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

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const RouteVisualization: React.FC<RouteVisualizationProps> = ({
  driverId,
  date,
  onRouteSelect,
}) => {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const directionsServiceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);

  // Load Google Maps API
  //   useEffect(() => {
  //     if (!window.google) {
  //       const script = document.createElement("script");
  //       script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
  //       script.async = true;
  //       script.defer = true;
  //       script.onload = () => {
  //         setMapLoaded(true);
  //         initializeMap();
  //       };
  //       document.head.appendChild(script);
  //     } else {
  //       setMapLoaded(true);
  //       initializeMap();
  //     }
  //   }, []);
  useEffect(() => {
    console.log("Google Maps useEffect triggered");
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Maps loaded");
        setMapLoaded(true);
        initializeMap();
      };
      script.onerror = (error) => {
        console.error("Failed to load Google Maps:", error);
      };
      document.head.appendChild(script);
    } else {
      console.log("Google Maps already loaded");
      setMapLoaded(true);
      initializeMap();
    }
  }, []); // Empty dependency array - should only run once

  // Fetch routes when component mounts or dependencies change
  useEffect(() => {
    if (driverId && date) {
      fetchRoutes();
    }
  }, [driverId, date]);

  // Update map when selected route changes
  useEffect(() => {
    if (selectedRoute && mapLoaded && mapInstanceRef.current) {
      renderRoute(selectedRoute);
    }
  }, [selectedRoute, mapLoaded]);

  const initializeMap = () => {
    if (mapRef.current && window.google) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: { lat: 13.3479, lng: 74.7824 }, // Default to Manipal coordinates
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      });

      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer(
        {
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: "#4285f4",
            strokeWeight: 4,
            strokeOpacity: 0.8,
          },
        }
      );

      directionsRendererRef.current.setMap(mapInstanceRef.current);
    }
  };

  const fetchRoutes = async () => {
    if (isFetching) {
      console.log("Already fetching, skipping...");
      return;
    }
    setIsLoading(true);
    setIsFetching(true);
    try {
      const response = await getRouteByDriverIdAndDate(driverId, date);
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to assign deliveries");
      }

      //   const data = await response.data;
      //   setRoutes(data.routes);
      // Fix: response.data contains the API response with success, message, data
      const apiResponse = response.data;

      // The actual routes are in apiResponse.data
      const routesData = apiResponse.data || [];

      console.log("API Response:", apiResponse); // Debug log
      console.log("Routes Data:", routesData); // Debug log

      if (routesData.length > 0) {
        setSelectedRoute(routesData[0]);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  const renderRoute = (route: RouteData) => {
    if (
      !directionsServiceRef.current ||
      !directionsRendererRef.current ||
      !route.route_details.route_geometry.waypoints.length
    ) {
      return;
    }

    const waypoints = route.route_details.route_geometry.waypoints;

    if (waypoints.length < 2) {
      console.warn("Not enough waypoints to render route");
      return;
    }

    // First waypoint is origin (driver start location)
    const origin = waypoints[0];
    // Last waypoint is destination
    const destination = waypoints[waypoints.length - 1];
    // Middle waypoints are delivery stops
    const waypointsForDirections = waypoints.slice(1, -1).map((wp) => ({
      location: new window.google.maps.LatLng(wp.lat, wp.lng),
      stopover: true,
    }));

    const request = {
      origin: new window.google.maps.LatLng(origin.lat, origin.lng),
      destination: new window.google.maps.LatLng(
        destination.lat,
        destination.lng
      ),
      waypoints: waypointsForDirections,
      optimizeWaypoints: false, // We already have optimized order
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC,
    };

    directionsServiceRef.current.route(request, (result: any, status: any) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRendererRef.current.setDirections(result);

        // Add custom markers for delivery stops
        addDeliveryMarkers(route);
      } else {
        console.error("Directions request failed:", status);
        // Fallback: show markers without route
        addDeliveryMarkers(route);
      }
    });
  };

  const addDeliveryMarkers = (route: RouteData) => {
    // Clear existing markers (if any)
    // Add markers for each delivery stop
    route.Assignment.forEach((assignment, index) => {
      const waypoint = route.route_details.route_geometry.waypoints.find(
        (wp) => wp.delivery_id === assignment.delivery.delivery_id
      );

      if (waypoint) {
        const marker = new window.google.maps.Marker({
          position: { lat: waypoint.lat, lng: waypoint.lng },
          map: mapInstanceRef.current,
          title: `${assignment.sequence_number}. ${assignment.delivery.customer.name}`,
          label: {
            text: assignment.sequence_number.toString(),
            color: "white",
            fontWeight: "bold",
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 20,
            fillColor: getPriorityColor(assignment.delivery.priority),
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 2,
          },
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
                Stop ${assignment.sequence_number}: ${
            assignment.delivery.customer.name
          }
              </h3>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>Address:</strong> ${
                  assignment.delivery.dropoff_location
                }
              </p>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>Phone:</strong> ${assignment.delivery.customer.phone}
              </p>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>ETA:</strong> ${new Date(
                  assignment.estimated_arrival
                ).toLocaleTimeString()}
              </p>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>Priority:</strong> ${assignment.delivery.priority}
              </p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });
      }
    });
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

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDistance = (meters: number) => {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading routes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Driver:</span>
                  <span className="font-medium">
                    {selectedRoute.route_details.driver_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Deliveries:</span>
                  <span className="font-medium">
                    {selectedRoute.route_details.total_deliveries}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Distance:</span>
                  <span className="font-medium">
                    {formatDistance(
                      selectedRoute.route_details.route_geometry.total_distance
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {formatDuration(
                      selectedRoute.route_details.route_geometry.total_duration
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Start Time:</span>
                  <span className="font-medium">
                    {new Date(
                      selectedRoute.route_details.start_time
                    ).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Est. End:</span>
                  <span className="font-medium">
                    {new Date(
                      selectedRoute.route_details.estimated_end_time
                    ).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Route Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={mapRef}
                className="w-full h-96 rounded-lg border"
                style={{ minHeight: "400px" }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delivery Stops List */}
      {selectedRoute && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Stops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedRoute.Assignment.sort(
                (a, b) => a.sequence_number - b.sequence_number
              ).map((assignment, index) => (
                <div
                  key={assignment.delivery.delivery_id}
                  className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{
                        backgroundColor: getPriorityColor(
                          assignment.delivery.priority
                        ),
                      }}
                    >
                      {assignment.sequence_number}
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">
                        {assignment.delivery.customer.name}
                      </span>
                      <Badge
                        variant={
                          assignment.delivery.priority === 1
                            ? "destructive"
                            : assignment.delivery.priority === 2
                            ? "default"
                            : "secondary"
                        }
                      >
                        Priority {assignment.delivery.priority}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{assignment.delivery.dropoff_location}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{assignment.delivery.customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          ETA:{" "}
                          {new Date(
                            assignment.estimated_arrival
                          ).toLocaleTimeString()}
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

      {routes.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No routes found for this driver on {date}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
