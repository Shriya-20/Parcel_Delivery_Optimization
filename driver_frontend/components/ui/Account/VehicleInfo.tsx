"use client";

import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";

export function VehicleInfo() {
  const [vehicleType, setVehicleType] = useState("sedan");

  const DocumentRow = ({ title, date }: { title: string; date: string }) => (
    <View className="flex-row justify-between items-center p-3 bg-gray-800 rounded-md">
      <View className="flex-row items-center space-x-3">
        <MaterialCommunityIcons
          name="file-document-outline"
          size={20}
          color="#FFD86B"
        />
        <View>
          <Text className="text-white font-medium">{title}</Text>
          <Text className="text-xs text-gray-400">Expires: {date}</Text>
        </View>
      </View>
      <TouchableOpacity className="px-3 py-1 bg-[#FFD86B] rounded-md">
        <Text className="text-sm font-medium text-gray-900">Update</Text>
      </TouchableOpacity>
    </View>
  );

  const MaintenanceRow = ({ title, date }: { title: string; date: string }) => (
    <View className="flex-row justify-between items-center p-3 border-b border-gray-700">
      <View>
        <Text className="text-white font-medium">{title}</Text>
        <Text className="text-sm text-gray-400">Last: {date}</Text>
      </View>
      <TouchableOpacity className="px-3 py-1 border border-[#FFD86B] rounded-md">
        <Text className="text-sm text-[#FFD86B] font-medium">Log</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 space-y-6 gap-2">
      {/* Vehicle Details */}
      <View className="bg-gray-800 rounded-xl p-4">
        <Text className="text-white text-base font-bold mb-3">
          Vehicle Details
        </Text>

        <View className="space-y-4">
          <View className="space-y-1">
            <Text className="text-xs text-gray-400">Vehicle Type</Text>
            <View className="flex-row bg-gray-700 rounded-lg overflow-hidden">
              {["sedan", "suv", "van", "truck"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setVehicleType(type)}
                  className={`flex-1 py-2 items-center ${
                    vehicleType === type ? "bg-[#FFD86B]" : ""
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      vehicleType === type ? "text-gray-900" : "text-gray-300"
                    }`}
                  >
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="flex-row space-x-2">
            <View className="flex-1 space-y-1">
              <Text className="text-xs text-gray-400">Make</Text>
              <TextInput
                defaultValue="Toyota"
                className="bg-white rounded-md px-3 py-2"
              />
            </View>
            <View className="flex-1 space-y-1">
              <Text className="text-xs text-gray-400">Model</Text>
              <TextInput
                defaultValue="Camry"
                className="bg-white rounded-md px-3 py-2"
              />
            </View>
          </View>

          <View className="flex-row space-x-2">
            <View className="flex-1 space-y-1">
              <Text className="text-xs text-gray-400">Year</Text>
              <TextInput
                defaultValue="2022"
                keyboardType="number-pad"
                className="bg-white rounded-md px-3 py-2"
              />
            </View>
            <View className="flex-1 space-y-1">
              <Text className="text-xs text-gray-400">Color</Text>
              <TextInput
                defaultValue="Silver"
                className="bg-white rounded-md px-3 py-2"
              />
            </View>
          </View>

          <View className="space-y-1">
            <Text className="text-xs text-gray-400">License Plate</Text>
            <TextInput
              defaultValue="ABC-1234"
              className="bg-white rounded-md px-3 py-2"
            />
          </View>
        </View>
      </View>

      {/* Documents */}
      <View className="bg-gray-800 rounded-xl p-4 space-y-3">
        <Text className="text-white text-base font-bold mb-3">Documents</Text>
        <DocumentRow title="Driver's License" date="06/15/2027" />
        <DocumentRow title="Vehicle Insurance" date="09/30/2025" />
        <DocumentRow title="Vehicle Registration" date="11/15/2025" />
      </View>

      {/* Maintenance */}
      <View className="bg-gray-800 rounded-xl p-4">
        <Text className="text-white text-base font-bold mb-3">Maintenance</Text>

        <View className="p-3 bg-yellow-100 border border-yellow-200 rounded-md flex-row items-start space-x-3 mb-4">
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={20}
            color="#854d0e"
          />
          <View>
            <Text className="font-medium text-yellow-800">
              Maintenance Reminder
            </Text>
            <Text className="text-sm text-yellow-800">
              Oil change recommended in 500 miles or 2 weeks.
            </Text>
          </View>
        </View>

        <View className="space-y-3">
          <MaintenanceRow title="Oil Change" date="March 10, 2025" />
          <MaintenanceRow title="Tire Rotation" date="February 22, 2025" />
          <MaintenanceRow title="Brake Inspection" date="January 15, 2025" />
        </View>
      </View>
    </View>
  );
}
