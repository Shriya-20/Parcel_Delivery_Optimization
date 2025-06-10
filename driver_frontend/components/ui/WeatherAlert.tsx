import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Card } from "react-native-paper";

interface WeatherAlertProps {
  latitude?: number;
  longitude?: number;
}

interface WeatherCondition {
  id: number;
  description: string;
}

interface WeatherData {
  weather: WeatherCondition[];
}

interface WeatherInfo {
  iconName:
    | "weather-pouring"
    | "weather-snowy"
    | "weather-sunny"
    | "weather-cloudy"
    | "weather-partly-cloudy";
  iconColor: string;
  message: string;
}

// Replace with your OpenWeatherMap API key
const OPEN_WEATHER_API_KEY = Constants?.expoConfig?.extra
  ?.openWeatherApiKey as string;

const WeatherAlert: React.FC<WeatherAlertProps> = ({
  latitude = 13.3409,
  longitude = 74.7421,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
        const res = await fetch(url);
        const data: WeatherData = await res.json();

        if (res.ok) {
          setWeather(data);
          setError(null);
        } else {
          setError(data.weather?.[0]?.description || "Failed to fetch weather");
          setWeather(null);
        }
      } catch (err) {
        setError((err as Error).message);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  const renderIconAndMessage = (): WeatherInfo | null => {
    if (!weather) return null;

    const weatherId = weather.weather[0].id;
    const description = weather.weather[0].description;

    if (weatherId >= 200 && weatherId < 600) {
      return {
        iconName: "weather-pouring",
        iconColor: "#eab308",
        message: `Heavy rain expected on your route. Condition: ${description}. Plan accordingly.`,
      };
    } else if (weatherId >= 600 && weatherId < 700) {
      return {
        iconName: "weather-snowy",
        iconColor: "#3b82f6",
        message: `Snowfall expected on your route. Condition: ${description}. Take care.`,
      };
    } else if (weatherId === 800) {
      return {
        iconName: "weather-sunny",
        iconColor: "#fbbf24",
        message: `Clear weather on your route. Enjoy your day!`,
      };
    } else if (weatherId > 800) {
      return {
        iconName: "weather-cloudy",
        iconColor: "#9ca3af",
        message: `Cloudy weather on your route. Condition: ${description}.`,
      };
    } else {
      return {
        iconName: "weather-partly-cloudy",
        iconColor: "#6b7280",
        message: `Weather update: ${description}.`,
      };
    }
  };

  const weatherInfo = renderIconAndMessage();

  if (loading) {
    return (
      <Card className="p-4 rounded-lg flex flex-row items-center gap-2 w-full mt-2 mb-4">
        <ActivityIndicator size="small" color="#eab308" />
        <Text className="text-white ml-2">Loading weather data...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 rounded-lg flex flex-row items-center gap-2 w-full mt-2 mb-4">
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={24}
          color="red"
        />
        <Text className="text-red-500 ml-2">Error: {error}</Text>
      </Card>
    );
  }

  return (
    <Card className="p-4 rounded-lg mt-2 mb-4">
      <View className="bg-gray-900 p-4 rounded-lg flex-1">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons
            name={weatherInfo!.iconName}
            size={32}
            // color={weatherInfo!.iconColor} lets see this afterwards
            color="white"
          />
          <View className="flex-1 ml-2">
            <Text className="text-white text-xl font-bold">
              Weather Alert
            </Text>
            <Text className="text-gray-300">{weatherInfo!.message}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default WeatherAlert;
