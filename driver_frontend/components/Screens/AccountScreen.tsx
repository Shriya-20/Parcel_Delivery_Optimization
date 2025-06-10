import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import {  useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { PerformanceMetrics } from "../ui/Account/PerformanceMetrics";
import { EarningsInfo } from "../ui/Account/EarningsInfo";
import { ProfileSettings } from "../ui/Account/ProfileSettings";
import { VehicleInfo } from "../ui/Account/VehicleInfo";
import { Link } from "expo-router";
import { ActivityIndicator } from "react-native-paper";

const AccountScreen = () => {
  const { logout,isMainLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("performance");
  if (isMainLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4 pb-20">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <View className="flex-row items-center">
              <Link href={"/(tabs)"}>
                <View className="rounded-lg p-2 mr-3">
                  <AntDesign name="back" size={32} color="#111827" />
                </View>
              </Link>
              <View>
                <Text className="text-2xl font-bold text-black">
                  Acount Overview
                </Text>
                <Text className="text-gray-900">
                  Manage Your Profile
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            className="flex-row items-center border border-red-500 rounded-lg px-4 py-2"
            onPress={() => logout()}
          >
            <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
            <Text className="ml-2 text-red-500 font-medium">Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center p-4 bg-gray-800 rounded-lg mb-4">
          <View className="w-16 h-16 rounded-full bg-gray-700 justify-center items-center">
            <MaterialCommunityIcons name="account" size={32} color="white" />
          </View>
          <View className="ml-4">
            <Text className="text-xl font-bold text-white">Keerthan Kumar C</Text>
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="star" size={16} color="#FFD86B" />
              <Text className="text-gray-300 ml-1">4.9 Rating</Text>
            </View>
          </View>
        </View>

        <View className="mb-4">
          <View className="flex-row bg-gray-800 rounded-lg overflow-hidden">
            <TouchableOpacity
              className={`flex-1 py-3 items-center ${
                activeTab === "performance" ? "bg-gray-700" : ""
              }`}
              onPress={() => setActiveTab("performance")}
            >
              <MaterialCommunityIcons
                name="chart-bar"
                size={20}
                color={activeTab === "performance" ? "#FFD86B" : "white"}
              />
              <Text
                className={`text-xs mt-1 ${
                  activeTab === "performance"
                    ? "text-[#FFD86B] font-medium"
                    : "text-gray-300"
                }`}
              >
                Performance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 items-center ${
                activeTab === "earnings" ? "bg-gray-700" : ""
              }`}
              onPress={() => setActiveTab("earnings")}
            >
              <MaterialCommunityIcons
                name="currency-usd"
                size={20}
                color={activeTab === "earnings" ? "#FFD86B" : "white"}
              />
              <Text
                className={`text-xs mt-1 ${
                  activeTab === "earnings"
                    ? "text-[#FFD86B] font-medium"
                    : "text-gray-300"
                }`}
              >
                Earnings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 items-center ${
                activeTab === "profile" ? "bg-gray-700" : ""
              }`}
              onPress={() => setActiveTab("profile")}
            >
              <MaterialCommunityIcons
                name="account"
                size={20}
                color={activeTab === "profile" ? "#FFD86B" : "white"}
              />
              <Text
                className={`text-xs mt-1 ${
                  activeTab === "profile"
                    ? "text-[#FFD86B] font-medium"
                    : "text-gray-300"
                }`}
              >
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 items-center ${
                activeTab === "vehicle" ? "bg-gray-700" : ""
              }`}
              onPress={() => setActiveTab("vehicle")}
            >
              <MaterialCommunityIcons
                name="truck"
                size={20}
                color={activeTab === "vehicle" ? "#FFD86B" : "white"}
              />
              <Text
                className={`text-xs mt-1 ${
                  activeTab === "vehicle"
                    ? "text-[#FFD86B] font-medium"
                    : "text-gray-300"
                }`}
              >
                Vehicle
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-gray-800 rounded-lg p-4 mt-2">
            {activeTab === "performance" && <PerformanceMetrics />}
            {activeTab === "earnings" && <EarningsInfo />}
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "vehicle" && <VehicleInfo />}
          </View>
        </View>

        {/* <View className="items-center">
          <TouchableOpacity
            className="flex-row items-center border border-red-500 rounded-lg px-4 py-2"
            onPress={() => logout()}
          >
            <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
            <Text className="ml-2 text-red-500 font-medium">Sign Out</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;
