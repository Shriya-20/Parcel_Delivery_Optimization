import DeliveryId from "@/components/ui/Active/DeliveryId";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";

const ActiveMain = () => {
  const [deliveryId, setDeliveryId] = React.useState<string>("");
  const router = useRouter();
  const handleChangeText = (text: string) => {
    setDeliveryId(text);
  };
  const handleSearch = () => {
    console.log("Searching for delivery ID:", deliveryId);
    const id  = deliveryId.trim();
    if (id.length === 0) {
      alert("Please enter a delivery ID");
      return;
    }
    router.push({
      pathname: "/(tabs)/active/[id]",
      params: { id: id },
    });
  };
  const onPressBacktoLogin = () => {
    // Handle back to login action
    console.log("Back to login");
    router.push("/(tabs)");
  };
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 flex-col gap-2 p-2 mt-2">
        <View className="flex-row w-full items-center p-4 rounded-lg">
          <View className="rounded-lg p-2 flex flex-col  ">
            <Text className="text-gray-900 font-bold text-2xl">
              Active Delivery
            </Text>
            <Text className="text-md text-gray-700">
              Track and manage your current deliveries
            </Text>
          </View>
        </View>
        <DeliveryId
          value={deliveryId}
          onChangeText={handleChangeText}
          onPressSearch={handleSearch}
        />
        {/* can add like to view delivery details also if needed */}
        {/* <View>
          <Text className="text-gray-900 font-bold text-2xl">
            Delivery Details
          </Text>
          <Text className="text-md text-gray-700">Enter the delivery ID to view details and track the package</Text>
        </View> */}
        <TouchableOpacity onPress={onPressBacktoLogin}>
          <Button
            mode="elevated"
            className="w-full rounded-lg items-center justify-center p-4 mt-3 mb-3"
            buttonColor="#FFD86B"
          >
            <View className="flex-row items-center justify-center pl-3 w-full">
              <Ionicons name="arrow-back-sharp" size={24} color="black" />
              <Text className="text-black font-semibold text-lg ml-2">
                Dashboard
              </Text>
            </View>
          </Button>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ActiveMain;
