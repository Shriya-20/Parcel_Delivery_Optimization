// import React from "react";
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   RefreshControl,
//   FlatList,
// } from "react-native";
// import { Text } from "react-native-paper";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import Feather from "@expo/vector-icons/Feather";
// import { useRouter } from "expo-router";
// import { DeliveryQueueForDriver } from "@/types";

// const priorityColors = {
//   high: { bg: "#fee2e2", text: "#b91c1c" },
//   medium: { bg: "#fef3c7", text: "#92400e" },
//   low: { bg: "#dcfce7", text: "#166534" },
// };

// interface DeliveryQueueProps {
//   deliveryQueue: DeliveryQueueForDriver[];
//   onRefresh?: () => void;
//   refreshing?: boolean;
// }

// const DeliveryQueue: React.FC<DeliveryQueueProps> = ({
//   deliveryQueue,
//   onRefresh,
//   refreshing = false,
// }) => {
//   const router = useRouter();

//   const handleNavigation = (id: string) => {
//     console.log("Navigating to delivery ID:", id);
//     router.push({
//       pathname: "/(tabs)/active/[id]",
//       params: { id: id },
//     });
//   };

//   const getPriorityInfo = (priority: number) => {
//     if (priority >= 7) return { level: "high", label: "High Priority" };
//     if (priority >= 4) return { level: "medium", label: "Medium Priority" };
//     return { level: "low", label: "Low Priority" };
//   };
//   const formatTime = (timeValue: Date | string) => {
//     if (!timeValue) return "N/A";

//     // If it's already a Date object
//     if (timeValue instanceof Date) {
//       return timeValue.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     }

//     // If it's a string, try to convert to Date
//     if (typeof timeValue === "string") {
//       const date = new Date(timeValue);
//       if (!isNaN(date.getTime())) {
//         return date.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         });
//       }
//     }

//     return "Invalid time";
//   };
//   const renderDeliveryItem = ({
//     item: delivery,
//   }: {
//     item: DeliveryQueueForDriver;
//   }) => {
//     const priorityInfo = getPriorityInfo(delivery.priority);
//     const priorityStyle =
//       priorityColors[priorityInfo.level as keyof typeof priorityColors];

//     return (
//       <TouchableOpacity
//         key={delivery.delivery_id}
//         style={styles.deliveryItem}
//         onPress={() => handleNavigation(delivery.delivery_id)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.deliveryContent}>
//           <View style={styles.iconContainer}>
//             <Feather name="package" size={20} color="#3b82f6" />
//           </View>

//           <View style={styles.deliveryInfo}>
//             <Text style={styles.address} numberOfLines={2}>
//               {delivery.dropoff_location}
//             </Text>
//             <View style={styles.timeContainer}>
//               <MaterialCommunityIcons
//                 name="clock-outline"
//                 size={14}
//                 color="#d1d5db"
//               />
//               <Text style={styles.time}>
//                 {formatTime(delivery.time_slot?.start_time)} -{" "}
//                 {formatTime(delivery.time_slot?.end_time)}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.rightContent}>
//           <View
//             style={[
//               styles.priorityBadge,
//               { backgroundColor: priorityStyle.bg },
//             ]}
//           >
//             {delivery.priority >= 7 && (
//               <MaterialCommunityIcons
//                 name="alert-circle-outline"
//                 size={12}
//                 color={priorityStyle.text}
//               />
//             )}
//             <Text style={[styles.priorityText, { color: priorityStyle.text }]}>
//               {priorityInfo.label}
//             </Text>
//           </View>

//           <MaterialCommunityIcons
//             name="chevron-right"
//             size={20}
//             color="#9ca3af"
//           />
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <MaterialCommunityIcons
//         name="package-variant-closed"
//         size={48}
//         color="#6b7280"
//       />
//       <Text style={styles.emptyTitle}>No deliveries yet</Text>
//       <Text style={styles.emptySubtitle}>
//         Your delivery queue is empty. New deliveries will appear here.
//       </Text>
//       {onRefresh && (
//         <TouchableOpacity
//           style={styles.refreshButton}
//           onPress={onRefresh}
//           activeOpacity={0.7}
//         >
//           <MaterialCommunityIcons name="refresh" size={16} color="#3b82f6" />
//           <Text style={styles.refreshButtonText}>Refresh</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   if (deliveryQueue.length === 0) {
//     return renderEmptyState();
//   }

//   return (
//     <FlatList
//       data={deliveryQueue}
//       renderItem={renderDeliveryItem}
//       keyExtractor={(item) => item.delivery_id}
//       contentContainerStyle={styles.container}
//       showsVerticalScrollIndicator={false}
//       scrollEnabled={false}
//       refreshControl={
//         onRefresh ? (
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor="#3b82f6"
//             colors={["#3b82f6"]}
//           />
//         ) : undefined
//       }
//       ItemSeparatorComponent={() => <View style={styles.separator} />}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//   },
//   separator: {
//     height: 12,
//   },
//   deliveryItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#4b5563",
//     borderRadius: 12,
//     backgroundColor: "#374151",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   deliveryContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   iconContainer: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: "rgba(59, 130, 246, 0.15)",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 16,
//     borderWidth: 1,
//     borderColor: "rgba(59, 130, 246, 0.3)",
//   },
//   deliveryInfo: {
//     flex: 1,
//     paddingRight: 8,
//   },
//   address: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#f9fafb",
//     lineHeight: 20,
//   },
//   timeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 6,
//   },
//   time: {
//     fontSize: 13,
//     color: "#d1d5db",
//     marginLeft: 6,
//     fontWeight: "500",
//   },
//   rightContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   priorityBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 16,
//     gap: 4,
//     minWidth: 80,
//     justifyContent: "center",
//   },
//   priorityText: {
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   emptyContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 40,
//     paddingHorizontal: 20,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#f9fafb",
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: "#9ca3af",
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   refreshButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(59, 130, 246, 0.1)",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "rgba(59, 130, 246, 0.3)",
//     gap: 6,
//   },
//   refreshButtonText: {
//     color: "#3b82f6",
//     fontWeight: "600",
//     fontSize: 14,
//   },
// });

// export default DeliveryQueue;

import { getPriorityInfo, formatTime } from "@/Lib/utils";
import { DeliveryQueueForDriver } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, TouchableOpacity, View, Text} from "react-native";

const priorityColors = {
  high: { bg: "#fee2e2", text: "#b91c1c" },
  medium: { bg: "#fef3c7", text: "#92400e" },
  low: { bg: "#dcfce7", text: "#166534" },
};

interface DeliveryQueueProps {
  deliveryQueue: DeliveryQueueForDriver[];
  onRefresh?: () => void;
  refreshing?: boolean;
}

const DeliveryQueue: React.FC<DeliveryQueueProps> = ({
  deliveryQueue,
  onRefresh,
  refreshing = false,
}) => {
  const router = useRouter();

  const handleNavigation = (id: string) => {
    // Navigate to the active delivery details page with the given ID
    router.push({
      pathname: "/(tabs)/active/[id]",
      params: { id },
    });
  };

  const renderItem = ({ item }: { item: DeliveryQueueForDriver }) => {
    const { level, label } = getPriorityInfo(item.priority);
    const colors = priorityColors[level as keyof typeof priorityColors];

    return (
      <TouchableOpacity
        className="bg-gray-600 p-4 rounded-lg mb-3 shadow-sm border-[white] border"
        onPress={() => handleNavigation(item.delivery_id)}
      >
        <View className="flex-row justify-between items-start mb-2 text-white">
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center justify-center bg-gray-800 w-12 h-12 rounded-full">
              <Feather name="package" size={20} color="white" />
            </View>
            <Text className="text-lg font-semibold text-white">
              {item.customer.first_name} {item.customer.last_name}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color="white" className="mt-2"/>
        </View>

        <Text className="text-md text-white mb-2">{item.dropoff_location}</Text>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="clock-outline"
              size={18}
              color="white"
            />
            <Text className="text-sm text-white">
              {formatTime(item.time_slot?.start_time)} -{" "}
              {formatTime(item.time_slot?.end_time)}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.bg,
              paddingHorizontal: 10,
              paddingVertical: 2,
              borderRadius: 9999,
            }}
          >
            <Text
              style={{ color: colors.text, fontSize: 12, fontWeight: "600" }}
            >
              {label}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={deliveryQueue}
      keyExtractor={(item) => item.delivery_id}
      renderItem={renderItem}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      scrollEnabled={false}
    />
  );
};
//!imp -> this flatlist inside the scrollview of delivery queue is not scrollable, so we need to set the scrollEnabled prop to false(or see what else we can do to make it scrollable)
export default DeliveryQueue;
