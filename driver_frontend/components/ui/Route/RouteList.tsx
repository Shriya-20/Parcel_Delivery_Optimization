import { formatTime } from "@/Lib/utils";
import { DeliveryQueueForDriver, DeliveryStatus } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {  Text, TouchableOpacity, View } from "react-native";

interface RouteListProps {
  deliveries?: DeliveryQueueForDriver[];
  onStatusUpdate?: (deliveryId: string, newStatus: DeliveryStatus) => void;
}

export function RouteList({ deliveries, onStatusUpdate }: RouteListProps) {
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const router = useRouter();
  const handleNavigation = (id: string) => {
    // Navigate to the active delivery details page with the given ID
    router.push({
      pathname: "/(tabs)/active/[id]",
      params: { id },
    });
  };
  const openMenu = (id: string) => {
    setMenuVisible(menuVisible === id ? null : id);
  };

  const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.completed:
        return "check-circle";
      case DeliveryStatus.in_progress:
        return "map-marker";
      case DeliveryStatus.cancelled:
        return "close-circle";
      default:
        return "map-marker";
    }
  };

  const getStatusText = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.completed:
        return "Completed";
      case DeliveryStatus.in_progress:
        return "In Progress";
      case DeliveryStatus.cancelled:
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  const handleViewDetails = (deliveryId: string) => {
    setMenuVisible(null);
    handleNavigation(deliveryId);
  };

  if (!deliveries || deliveries.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <MaterialCommunityIcons
          name="truck-outline"
          size={48}
          color="#9CA3AF"
        />
        <Text className="text-gray-400 text-center mt-4 text-base">
          No deliveries scheduled for today
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-2">
      {deliveries.map((delivery) => (
        <TouchableOpacity
          key={delivery.delivery_id}
          onPress={() => handleViewDetails(delivery.delivery_id)}
          className={`p-4 rounded-lg ${
            delivery.status === DeliveryStatus.in_progress
              ? "border-2 border-yellow-400 bg-gray-800"
              : "bg-gray-800"
          }`}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-gray-600 justify-center items-center mr-3">
                <MaterialCommunityIcons
                  name={getStatusIcon(delivery.status)}
                  size={20}
                  color={
                    delivery.status === DeliveryStatus.completed
                      ? "#10B981"
                      : "white"
                  }
                />
              </View>

              <View className="flex-1">
                <Text className="font-semibold text-white text-base">
                  {delivery.dropoff_location}
                </Text>
                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={12}
                    color="#9CA3AF"
                  />
                  <Text className="text-sm text-gray-400 ml-1">
                    {formatTime(delivery.time_slot.start_time)}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center space-x-3">
              <View className="bg-gray-700 px-3 py-1 rounded-full">
                <Text className="text-xs font-medium text-white">
                  {getStatusText(delivery.status)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => openMenu(delivery.delivery_id)}
                className="w-8 h-8 justify-center items-center"
              >
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Simple Dropdown Menu */}
          {menuVisible === delivery.delivery_id && (
            <View className="mt-3 bg-gray-700 rounded-lg overflow-hidden">
              <TouchableOpacity
                onPress={() => handleViewDetails(delivery.delivery_id)}
                className="px-4 py-3 border-b border-gray-600"
              >
                <Text className="text-white font-medium">View Details</Text>
              </TouchableOpacity>

              {delivery.status !== DeliveryStatus.completed && (
                <TouchableOpacity
                  onPress={() => {
                    onStatusUpdate?.(
                      delivery.delivery_id,
                      DeliveryStatus.cancelled
                    );
                    setMenuVisible(null);
                  }}
                  className="px-4 py-3 border-b border-gray-600"
                >
                  <Text className="text-yellow-500 font-medium">
                    Skip Delivery
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => setMenuVisible(null)}
                className="px-4 py-3"
              >
                <Text className="text-red-400 font-medium">Report Issue</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
