import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type RecentDelivery = {
  id: string;
  address: string;
  time: string;
  status: "completed" | "in-progress" | "pending";
};

const recentDeliveries: RecentDelivery[] = [
  {
    id: "DEL-1234",
    address: "123 Main St, Apt 4B",
    time: "10:30 AM",
    status: "in-progress",
  },
  {
    id: "DEL-1235",
    address: "456 Oak Ave",
    time: "11:15 AM",
    status: "pending",
  },
  {
    id: "DEL-1233",
    address: "987 Elm St",
    time: "9:15 AM",
    status: "completed",
  },
];

const statusClasses = {
  completed: "bg-green-100 text-green-800",
  "in-progress": "bg-blue-100 text-blue-800",
  pending: "bg-gray-100 text-gray-800",
};

interface RecentDeliveriesProps {
  navigation: any;
}

export function RecentDeliveries({ navigation }: RecentDeliveriesProps) {
  return (
    <View className="space-y-3 mt-2">
      {recentDeliveries.map((delivery) => (
        <TouchableOpacity
          key={delivery.id}
          className="flex-row justify-between items-center p-3 border border-gray-200 rounded-lg bg-white"
          onPress={() =>
            navigation.navigate("DeliveryDetail", { id: delivery.id })
          }
        >
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-full bg-blue-100 justify-center items-center mr-3">
              {delivery.status === "completed" ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#3b82f6"
                />
              ) : (
                <MaterialCommunityIcons
                  name="package-variant"
                  size={20}
                  color="#3b82f6"
                />
              )}
            </View>
            <View className="flex-1">
              <Text className="font-medium">{delivery.address}</Text>
              <View className="flex-row items-center mt-1">
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={12}
                  color="#6b7280"
                />
                <Text className="text-xs text-gray-500 ml-1">
                  {delivery.time}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center space-x-2">
            <View
              className={`px-2 py-1 rounded-full ${
                statusClasses[delivery.status]
              }`}
            >
              <Text className="text-xs font-medium">
                {delivery.status === "completed"
                  ? "Completed"
                  : delivery.status === "in-progress"
                  ? "In Progress"
                  : "Pending"}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="#6b7280"
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
