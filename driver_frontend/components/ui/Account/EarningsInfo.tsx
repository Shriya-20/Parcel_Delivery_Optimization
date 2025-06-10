import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type TabType = "week" | "month" | "year";

type EarningsStatProps = {
  label: string;
  value: string;
};

const EarningsStat: React.FC<EarningsStatProps> = ({ label, value }) => {
  return (
    <View className="w-1/2 p-1">
      <View className="p-3 bg-gray-700 rounded-lg">
        <Text className="text-sm text-gray-400">{label}</Text>
        <Text className="font-bold text-white">{value}</Text>
      </View>
    </View>
  );
};

type PaymentHistoryItemProps = {
  title: string;
  date: string;
  amount: string;
};

const PaymentHistoryItem: React.FC<PaymentHistoryItemProps> = ({
  title,
  date,
  amount,
}) => {
  return (
    <View className="flex-row justify-between items-center p-3 border-b border-gray-700">
      <View>
        <Text className="font-medium text-white">{title}</Text>
        <Text className="text-sm text-gray-400">{date}</Text>
      </View>
      <View className="items-end">
        <Text className="font-bold text-white">{amount}</Text>
        <TouchableOpacity
          className="flex-row items-center mt-1 py-1 px-2 rounded-md bg-gray-700"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="download"
            size={12}
            color="#FFD86B"
            style={{ marginRight: 4 }}
          />
          <Text className="text-xs text-[#FFD86B]">Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const EarningsInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("week");

  const weeklyStats = [
    { label: "Deliveries", value: "68" },
    { label: "Avg. Per Delivery", value: "$12.39" },
    { label: "Tips", value: "$124.50" },
    { label: "Hours", value: "32.5" },
  ];

  const paymentHistory = [
    { title: "Weekly Payment", date: "April 15, 2025", amount: "$845.32" },
    { title: "Weekly Payment", date: "April 8, 2025", amount: "$792.18" },
    { title: "Weekly Payment", date: "April 1, 2025", amount: "$812.45" },
  ];

  const renderEarningsContent = () => {
    switch (activeTab) {
      case "week":
        return (
          <View>
            <View className="items-center mb-4">
              <Text className="text-gray-400">Total Earnings</Text>
              <Text className="text-3xl font-bold text-white">$842.50</Text>
              <View className="flex-row items-center mt-1">
                <MaterialCommunityIcons
                  name="trending-up"
                  size={12}
                  color="#16a34a"
                />
                <Text className="text-xs text-green-500 ml-1">
                  12% from last week
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap -mx-1">
              {weeklyStats.map((stat, index) => (
                <EarningsStat
                  key={index}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
            </View>
          </View>
        );
      case "month":
        return (
          <View className="items-center mb-4">
            <Text className="text-gray-400">Total Earnings</Text>
            <Text className="text-3xl font-bold text-white">$3,245.75</Text>
            <View className="flex-row items-center mt-1">
              <MaterialCommunityIcons
                name="trending-up"
                size={12}
                color="#16a34a"
              />
              <Text className="text-xs text-green-500 ml-1">
                8% from last month
              </Text>
            </View>
          </View>
        );
      case "year":
        return (
          <View className="items-center mb-4">
            <Text className="text-gray-400">Total Earnings</Text>
            <Text className="text-3xl font-bold text-white">$38,642.30</Text>
            <View className="flex-row items-center mt-1">
              <MaterialCommunityIcons
                name="trending-up"
                size={12}
                color="#16a34a"
              />
              <Text className="text-xs text-green-500 ml-1">
                15% from last year
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 ">
      <View className="space-y-4 gap-2">
        {/* Earnings Summary Card */}
        <View className="p-4 bg-gray-800 rounded-xl shadow">
          <Text className="text-base font-bold mb-3 text-white">
            Earnings Summary
          </Text>

          {/* Period Tabs */}
          <View className="flex-row bg-gray-700 rounded-lg overflow-hidden mb-4">
            {(["week", "month", "year"] as TabType[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                className={`flex-1 py-2 items-center ${
                  activeTab === tab ? "bg-[#FFD86B]" : ""
                }`}
                activeOpacity={0.7}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  className={
                    activeTab === tab
                      ? "text-gray-900 font-medium"
                      : "text-gray-400"
                  }
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {renderEarningsContent()}
        </View>

        {/* Payment History Card */}
        <View className="p-4 bg-gray-800 rounded-xl shadow mb-4">
          <Text className="text-base font-bold mb-3 text-white">
            Payment History
          </Text>
          <View className="space-y-3">
            {paymentHistory.map((payment, index) => (
              <PaymentHistoryItem
                key={index}
                title={payment.title}
                date={payment.date}
                amount={payment.amount}
              />
            ))}
          </View>

          {/* View All Button */}
          <TouchableOpacity
            className="mt-4 bg-gray-700 py-3 rounded-lg items-center"
            activeOpacity={0.7}
          >
            <Text className="text-[#FFD86B] font-medium">
              View All Payments
            </Text>
          </TouchableOpacity>
        </View>

        {/* Download Report Button */}
        <TouchableOpacity
          className="my-2 bg-[#FFD86B] py-3 rounded-lg items-center"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="file-download-outline"
              size={18}
              color="#111827"
            />
            <Text className="text-gray-900 font-bold ml-2">
              Download Earnings Report
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
