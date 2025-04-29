"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";

type Delivery = {
  id: string;
  address: string;
  time: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
};

const deliveries: Delivery[] = [
  {
    id: "DEL-1234",
    address: "Diana Circle, Udupi, Karnataka",
    time: "10:30 AM",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "DEL-1235",
    address: "Manipal University, Udupi, Karnataka",
    time: "11:15 AM",
    priority: "medium",
    status: "pending",
  },
  {
    id: "DEL-1236",
    address: "Malpe Beach, Udupi, Karnataka",
    time: "12:00 PM",
    priority: "medium",
    status: "pending",
  },
  {
    id: "DEL-1237",
    address: "Sri Krishna Temple, Car Street, Udupi, Karnataka",
    time: "1:30 PM",
    priority: "low",
    status: "pending",
  },
  {
    id: "DEL-1238",
    address: "Kodi Beach, Udupi, Karnataka",
    time: "2:45 PM",
    priority: "low",
    status: "pending",
  },
];

export  function DeliveryMap({ deliveryId}: { deliveryId: string }) {
  const [currentLocation] = useState("Udupi City Bus Stand, Udupi, Karnataka");
  const [eta, setEta] = useState("");

  const delivery = deliveries.find((d) => d.id === deliveryId) || deliveries[0];

  useEffect(() => {
    // Simulate different ETAs based on delivery priority
    const etaTimes = {
      high: "10 minutes",
      medium: "15 minutes",
      low: "25 minutes",
    };
    setEta(etaTimes[delivery.priority]);
  }, [delivery]);

  // Create Google Maps embed URL
  const origin = encodeURIComponent(currentLocation);
  const destination = encodeURIComponent(delivery.address);
  const mapUrl = `https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&origin=${origin}&destination=${destination}&mode=driving`;

  return (
    <div className="flex flex-col w-full space-y-4">
      <Card className="shadow-lg overflow-hidden">
        <div className="h-80 bg-gray-100">
          <iframe
            src={mapUrl}
            className="w-full h-full border-0"
            title="Delivery Route Map"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="p-4 bg-white">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <MapPin className="text-blue-600 mr-2" size={20} />
              <div>
                <h3 className="font-bold">{delivery.address}</h3>
                <p className="text-sm text-gray-600">Delivery #{delivery.id}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="text-green-600 mr-2" size={20} />
              <p className="font-medium">ETA: {eta}</p>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                From: <span className="font-medium">{currentLocation}</span>
              </p>
              <p className="text-sm text-gray-600">
                Scheduled for:{" "}
                <span className="font-medium">{delivery.time}</span>
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                delivery.priority === "high"
                  ? "bg-red-100 text-red-800"
                  : delivery.priority === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {delivery.priority.charAt(0).toUpperCase() +
                delivery.priority.slice(1)}{" "}
              Priority
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
