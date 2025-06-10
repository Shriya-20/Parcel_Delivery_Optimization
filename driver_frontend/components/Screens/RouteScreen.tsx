import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteList } from "../ui/Route/RouteList";
import { Link, useRouter } from "expo-router";
import { DashboardDataFetcher } from "@/Lib/fetchDataServices";
import { DeliveryQueueForDriver, DeliveryStatus } from "@/types";
import { useState, useCallback, useEffect } from "react";
import Toast from "react-native-toast-message";
// import { useAuth } from "@/context/AuthContext";

const RouteScreen = () => {
  const [deliveryQueue, setDeliveryQueue] = useState<DeliveryQueueForDriver[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchDeliveryQueue = useCallback(
    async (showToast = true) => {
      try {
        setError(null);
        if (!refreshing) {
          setIsLoading(true);
        }

        const mockDriverId = "69ca617c-9259-492f-a73a-e9e351204678";
        const mockDate = "2025-05-27";
        const queue = await DashboardDataFetcher(mockDriverId, mockDate);

        setDeliveryQueue(queue);

        if (showToast) {
          Toast.show({
            type: queue.length > 0 ? "success" : "info",
            text1: queue.length > 0 ? "Success" : "Info",
            text2:
              queue.length > 0
                ? `Loaded ${queue.length} deliveries successfully`
                : "No deliveries found for today",
            position: "top",
            visibilityTime: 3000,
          });
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch deliveries";
        setError(message);

        if (showToast) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: `Error loading deliveries: ${message}`,
            position: "top",
            visibilityTime: 4000,
          });
        }
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [refreshing]
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDeliveryQueue(true);
  }, [fetchDeliveryQueue]);

  const handleStatusUpdate = useCallback(
    (deliveryId: string, newStatus: DeliveryStatus) => {
      setDeliveryQueue((prev) =>
        prev.map((delivery) =>
          delivery.delivery_id === deliveryId
            ? { ...delivery, status: newStatus }
            : delivery
        )
      );
    },
    []
  );

  useEffect(() => {
    fetchDeliveryQueue(false);
  }, [fetchDeliveryQueue]);

  const getDeliveryStats = () => {
    const completed = deliveryQueue.filter(
      (d) => d.status === DeliveryStatus.completed
    ).length;
    const inProgress = deliveryQueue.filter(
      (d) => d.status === DeliveryStatus.in_progress
    ).length;
    const pending = deliveryQueue.filter(
      (d) => d.status === DeliveryStatus.pending
    ).length;

    return { completed, inProgress, pending, total: deliveryQueue.length };
  };

  const stats = getDeliveryStats();

  if (isLoading ) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFD86B" />
          <Text className="text-gray-600 mt-4 text-lg">
            Loading your route...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !deliveryQueue.length) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center p-6">
          <AntDesign name="exclamationcircleo" size={64} color="#EF4444" />
          <Text className="text-red-600 font-bold text-2xl mt-4">Oops!</Text>
          <Text className="text-gray-600 text-center mt-2 text-lg leading-6">
            {error}
          </Text>
          <Button
            mode="contained"
            onPress={() => fetchDeliveryQueue(true)}
            className="mt-6"
            buttonColor="#FFD86B"
            textColor="#000"
          >
            Try Again
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-white px-4 py-6 shadow-sm">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center flex-1">
              <Link href="/(tabs)" asChild>
                <TouchableOpacity className="rounded-lg p-2 mr-3 bg-gray-100">
                  <AntDesign name="arrowleft" size={24} color="#111827" />
                </TouchableOpacity>
              </Link>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900">
                  Route Overview
                </Text>
                <Text className="text-gray-600 mt-1">{currentDate}</Text>
              </View>
            </View>

            <TouchableOpacity
              className="flex-row items-center bg-[#FFD86B] rounded-lg px-4 py-2 shadow"
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <MaterialCommunityIcons
                name={refreshing ? "loading" : "refresh"}
                size={18}
                color="black"
              />
              <Text className="text-black ml-2 font-semibold">
                {refreshing ? "Updating..." : "Refresh"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-4 py-4">
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-white p-4 rounded-lg shadow-sm">
              <Text className="text-2xl font-bold text-gray-900">
                {stats.total}
              </Text>
              <Text className="text-gray-600 text-sm">Total Deliveries</Text>
            </View>
            <View className="flex-1 bg-white p-4 rounded-lg shadow-sm">
              <Text className="text-2xl font-bold text-green-600">
                {stats.completed}
              </Text>
              <Text className="text-gray-600 text-sm">Completed</Text>
            </View>
            <View className="flex-1 bg-white p-4 rounded-lg shadow-sm">
              <Text className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </Text>
              <Text className="text-gray-600 text-sm">Pending</Text>
            </View>
          </View>
        </View>

        {/* Deliveries List */}
        <View className="px-4 pb-6">
          <View className="bg-gray-900 rounded-lg p-4 shadow-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-white">
                Today&apos;s Deliveries
              </Text>
              <View className="bg-gray-700 rounded-full px-3 py-1">
                <Text className="text-[#FFD86B] text-sm font-semibold">
                  {stats.total} Items
                </Text>
              </View>
            </View>

            <RouteList
              deliveries={deliveryQueue}
              onStatusUpdate={handleStatusUpdate}
            />
          </View>
        </View>

        {/* Action Button */}
        <View className="px-4 pb-8">
          <TouchableOpacity
            className="bg-[#FFD86B] rounded-lg px-6 py-4 shadow-lg"
            onPress={() => console.log("Request route change")}
          >
            <Text className="text-black text-center text-lg font-bold">
              Request Route Change
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RouteScreen;
