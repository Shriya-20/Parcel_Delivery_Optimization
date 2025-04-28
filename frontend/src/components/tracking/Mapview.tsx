import { useEffect, useState } from "react";

interface Driver {
  id: string;
  name: string;
  status: string;
  location: {
    lat: number;
    lng: number;
  };
  vehicle: string;
}

interface MapViewProps {
  drivers: Driver[];
}

export function MapView({ drivers }: MapViewProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // In a real implementation, this would initialize a map library like Google Maps or Mapbox
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full w-full">
      {!mapLoaded ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="h-full w-full bg-white relative">
          {/* This would be a real map in a production app */}
          <div className="absolute inset-0 bg-[#f2f5f7]">
            <svg
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <line x1="0" y1="0" x2="100" y2="100" stroke="#e2e2e2" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="#e2e2e2" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="#e2e2e2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e2e2" />
            </svg>
          </div>

          {/* Plot drivers on the map */}
          {drivers.map((driver) => {
            // In a real app, we'd use the actual geo coordinates
            const randomX = Math.random() * 80 + 10;
            const randomY = Math.random() * 80 + 10;

            const getStatusColor = (status: string) => {
              switch (status) {
                case "active":
                  return "#4CAF50"; // Green
                case "break":
                  return "#FFC107"; // Yellow
                case "inactive":
                  return "#F44336"; // Red
                default:
                  return "#9E9E9E"; // Grey
              }
            };

            return (
              <div
                key={driver.id}
                className="absolute h-6 w-6 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{
                  left: `${randomX}%`,
                  top: `${randomY}%`,
                  backgroundColor: getStatusColor(driver.status),
                }}
                title={driver.name}
              >
                <span className="text-white text-xs font-bold">
                  {driver.vehicle === "truck"
                    ? "T"
                    : driver.vehicle === "van"
                    ? "V"
                    : driver.vehicle === "minivan"
                    ? "M"
                    : "C"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
