import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
interface DeliveryIdProps {
  value: string;
  onChangeText: (text: string) => void;
  onPressSearch: () => void;
}
const DeliveryId = ({ value, onChangeText, onPressSearch }: DeliveryIdProps) => {
  return (
    <View className="bg-gray-900 w-full rounded-lg p-4 shadow-md flex flex-col gap-2">
      {/* Title and Subtitle */}
      <View className="flex-col gap-3 w-full mt-2 mb-2">
        <View className="flex-row gap-2 items-center">
          <View className="rounded-lg p-2">
            <MaterialCommunityIcons
              name="package-variant"
              size={24}
              color="white"
            />
          </View>
          <Text className="text-white text-xl font-bold">
            Enter Delivery ID
          </Text>
        </View>
        <Text className="text-white text-lg">
          Enter the delivery ID to view details and track the package
        </Text>
      </View>

      {/* Input Field and Search */}
      <View className="flex flex-col">
        <Text className="text-white text-lg mb-2">Delivery ID</Text>
        <View className="w-full rounded-lg flex-row gap-2 items-center">
          <View className="flex-1">
            <TextInput
              mode="outlined"
              placeholder="fdd3965e-bcbf-447e-95a5..."
              textColor="black"
              value={value}
              onChangeText={onChangeText}
              style={{ backgroundColor: "white" }}
            />
          </View>
          <TouchableOpacity
            onPress={onPressSearch}
            className="bg-gray-700 rounded-lg p-4 items-center justify-center"
          >
            <MaterialCommunityIcons name="magnify" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DeliveryId;
