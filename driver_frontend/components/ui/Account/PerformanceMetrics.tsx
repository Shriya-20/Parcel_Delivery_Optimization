import React from "react";
import { View, Text, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type StarRatingProps = {
  rating: number;
  maxRating?: number;
  size?: number;
};

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 16,
}) => {
  return (
    <View className="flex-row">
      {Array.from({ length: maxRating }).map((_, index) => (
        <MaterialCommunityIcons
          key={index}
          name="star"
          size={size}
          color="#FFD86B"
          className="mr-1"
        />
      ))}
    </View>
  );
};

type MetricItemProps = {
  icon: string;
  label: string;
  value: string | number;
  valueUnit?: string;
  iconColor?: string;
};

const MetricItem: React.FC<MetricItemProps> = ({
  icon,
  label,
  value,
  valueUnit,
  iconColor = "#FFD86B",
}) => {
  return (
    <View className="flex-row justify-between items-center py-2">
      <View className="flex-row items-center">
        <MaterialCommunityIcons
          name={icon as any}
          size={16}
          color={iconColor}
          className="mr-2"
        />
        <Text className="text-white">{label}</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-white font-bold">{value}</Text>
        {valueUnit && (
          <Text className="text-gray-400 text-xs ml-1">{valueUnit}</Text>
        )}
      </View>
    </View>
  );
};

type FeedbackItemProps = {
  rating: number;
  date: string;
  comment: string;
};

const FeedbackItem: React.FC<FeedbackItemProps> = ({
  rating,
  date,
  comment,
}) => {
  return (
    <View className="p-3 bg-gray-700 rounded-lg">
      <View className="flex-row justify-between items-center mb-1">
        <StarRating rating={rating} />
        <Text className="text-xs text-gray-400">{date}</Text>
      </View>
      <Text className="text-sm text-white">{comment}</Text>
    </View>
  );
};

export const PerformanceMetrics: React.FC = () => {
  const feedbackItems: FeedbackItemProps[] = [
    {
      rating: 5,
      date: "Yesterday",
      comment:
        "Very professional and friendly. Package was delivered safely and on time.",
    },
    {
      rating: 5,
      date: "2 days ago",
      comment:
        "Driver went above and beyond to ensure my package was delivered safely.",
    },
  ];

  return (
    <ScrollView className="flex-1 ">
      <View className="space-y-4 gap-2">
        {/* Performance Overview Card */}
        <View className="p-4 bg-gray-800 rounded-xl shadow">
          <Text className="text-base text-white font-bold mb-3">
            Performance Overview
          </Text>
          <View className="space-y-4">
            <MetricItem
              icon="star"
              label="Customer Rating"
              value="4.9"
              valueUnit="/5"
            />
            <MetricItem icon="clock-outline" label="On-Time Rate" value="98%" />
            <MetricItem
              icon="package-variant"
              label="Successful Deliveries"
              value="99.5%"
            />
            <MetricItem
              icon="thumb-up"
              label="Customer Compliments"
              value="32"
            />
          </View>
        </View>

        {/* Weekly Performance Card */}
        <View className="p-4 bg-gray-800 rounded-xl shadow">
          <Text className="text-base text-white font-bold mb-3">
            Weekly Performance
          </Text>
          <View className="h-48 bg-gray-700 rounded-lg flex items-center justify-center">
            <View className="items-center">
              <MaterialCommunityIcons
                name="chart-bar"
                size={32}
                color="#9ca3af"
                className="mb-2"
              />
              <Text className="text-white">Performance Chart</Text>
              <Text className="text-gray-400 text-xs">
                Deliveries and ratings over time
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Feedback Card */}
        <View className="p-4 bg-gray-800 rounded-xl shadow">
          <Text className="text-base text-white font-bold mb-3">
            Recent Feedback
          </Text>
          <View className="space-y-3 gap-2">
            {feedbackItems.map((item, index) => (
              <FeedbackItem
                key={index}
                rating={item.rating}
                date={item.date}
                comment={item.comment}
              />
            ))}
          </View>
        </View>

        {/* Action Button */}
        <View className="items-center my-4">
          <View className="bg-[#FFD86B] px-6 py-3 rounded-lg">
            <Text className="text-gray-900 font-bold text-center">
              View All Feedback
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
