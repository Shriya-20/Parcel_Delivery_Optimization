import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
    address: "123 Main St, Apt 4B",
    time: "10:30 AM",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "DEL-1235",
    address: "456 Oak Ave",
    time: "11:15 AM",
    priority: "medium",
    status: "pending",
  },
  {
    id: "DEL-1236",
    address: "789 Pine Blvd, Suite 3",
    time: "12:00 PM",
    priority: "medium",
    status: "pending",
  },
  {
    id: "DEL-1237",
    address: "321 Cedar Ln",
    time: "1:30 PM",
    priority: "low",
    status: "pending",
  },
  {
    id: "DEL-1238",
    address: "654 Maple Dr",
    time: "2:45 PM",
    priority: "low",
    status: "pending",
  },
];

const priorityColors = {
  high: { bg: "#fee2e2", text: "#b91c1c" },
  medium: { bg: "#fef3c7", text: "#92400e" },
  low: { bg: "#dcfce7", text: "#166534" },
};

interface DeliveryQueueProps {
  navigation: any;
}

const DeliveryQueue = ({ navigation }: DeliveryQueueProps) => {
  return (
    <View style={styles.container}>
      {deliveries.map((delivery) => (
        <TouchableOpacity
          key={delivery.id}
          style={styles.deliveryItem}
          onPress={() =>
            navigation.navigate("DeliveryDetail", { id: delivery.id })
          }
        >
          <View style={styles.deliveryContent}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="package-variant"
                size={20}
                color="#3b82f6"
              />
            </View>
            <View style={styles.deliveryInfo}>
              <Text style={styles.address}>{delivery.address}</Text>
              <View style={styles.timeContainer}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={12}
                  color="#6b7280"
                />
                <Text style={styles.time}>{delivery.time}</Text>
              </View>
            </View>
          </View>
          <View style={styles.rightContent}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: priorityColors[delivery.priority].bg },
              ]}
            >
              {delivery.priority === "high" && (
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={12}
                  color={priorityColors[delivery.priority].text}
                />
              )}
              <Text
                style={[
                  styles.priorityText,
                  { color: priorityColors[delivery.priority].text },
                ]}
              >
                {delivery.priority.charAt(0).toUpperCase() +
                  delivery.priority.slice(1)}
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
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  deliveryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "white",
  },
  deliveryContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  deliveryInfo: {
    flex: 1,
  },
  address: {
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default DeliveryQueue;
