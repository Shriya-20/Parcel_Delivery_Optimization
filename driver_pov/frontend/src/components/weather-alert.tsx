"use client";

import { useEffect, useState } from "react";
import { CloudRain, Sun, Cloud } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type WeatherData = {
  weatherCondition: {
    description: {
      text: string;
    };
    type: string;
  };
  temperature: {
    degrees: number;
  };
  precipitation: {
    probability: {
      percent: number;
      type: string;
    };
  };
};

const LATITUDE = 13.3409;
const LONGITUDE = 74.7421;

export function WeatherAlert() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://weather.googleapis.com/v1/currentConditions:lookup?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&location.latitude=${LATITUDE}&location.longitude=${LONGITUDE}`
        );

        if (!res.ok) throw new Error("Failed to fetch weather");

        const data = await res.json();
        setWeather(data);
      } catch (err) {
        setError("Unable to fetch weather at this time.");
        console.error(err);
      }
    }

    fetchWeather();
  }, []);

  if (error) return null;
  if (!weather) return null;

  const isRainLikely =
    weather.precipitation.probability.percent >= 50 &&
    weather.precipitation.probability.type === "RAIN";

  const WeatherIcon =
    weather.weatherCondition.type === "CLEAR"
      ? Sun
      : weather.weatherCondition.type.includes("RAIN")
      ? CloudRain
      : Cloud;

  return (
    <Alert
      variant={isRainLikely ? "destructive" : "default"}
      className={`${
        isRainLikely
          ? "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900"
          : "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900"
      }`}
    >
      <WeatherIcon className="h-8 w-8 mr-2 text-black  z-10" />
      <AlertTitle>Weather Alert</AlertTitle>
      <AlertDescription>
        {weather.weatherCondition.description.text}.{" "}
        {isRainLikely
          ? "Rain expected. Plan accordingly."
          : "No significant rain expected today."}{" "}
        Temperature: {weather.temperature.degrees}°C
      </AlertDescription>
    </Alert>
  );
}
