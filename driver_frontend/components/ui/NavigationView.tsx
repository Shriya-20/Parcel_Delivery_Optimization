import React, { useEffect, useCallback, useMemo, useState } from "react";
import { View, Text, Button, PermissionsAndroid, Platform } from "react-native";
import {
  NavigationView,
  useNavigation,
  TravelMode,
  type DisplayOptions,
} from "@googlemaps/react-native-navigation-sdk";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";

const NavigationScreen = () => {
  const { navigationController, addListeners, removeListeners } =
    useNavigation();
  const [hasPermissions, setHasPermissions] = useState(false);

  // 1. Request location permissions
  const requestPermissions = async () => {
    const result = await request(
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_ALWAYS
    );

    setHasPermissions(result === RESULTS.GRANTED);
  };

  // 2. Init navigation
  const initializeNavigation = useCallback(async () => {
    try {
      await navigationController.init();
      console.log("Navigation initialized");
    } catch (err) {
      console.error("Navigation init error", err);
    }
  }, [navigationController]);

  // 3. Start guidance
  const startGuidance = async () => {
    try {
      const waypoint = {
        title: "Google HQ",
        position: { lat: 37.4220679, lng: -122.0859545 },
      };

      const routingOptions = {
        travelMode: TravelMode.DRIVING,
        avoidFerries: false,
        avoidTolls: false,
      };

      const displayOptions: DisplayOptions = {
        showDestinationMarkers: true,
        showStopSigns: true,
        showTrafficLights: true,
      };

      await navigationController.setDestinations(
        [waypoint],
        routingOptions,
        displayOptions
      );
      await navigationController.startGuidance();
    } catch (error) {
      console.error("Error starting guidance", error);
    }
  };

  const stopGuidance = async () => {
    try {
      await navigationController.stopGuidance();
    } catch (err) {
      console.error("Error stopping guidance", err);
    }
  };

  // 4. Listen for arrival
  const onArrival = useCallback(
    (event: any) => {
      if (event.isFinalDestination) {
        console.log("Arrived at final destination");
        navigationController.stopGuidance();
      } else {
        console.log("Continuing to next destination");
        navigationController.continueToNextDestination();
        navigationController.startGuidance();
      }
    },
    [navigationController]
  );

  const navigationCallbacks = useMemo(() => ({ onArrival }), [onArrival]);

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (hasPermissions) {
      initializeNavigation();
      addListeners(navigationCallbacks);
      return () => removeListeners(navigationCallbacks);
    }
  }, [hasPermissions, initializeNavigation]);

  return (
    <View className="flex-1">
      {hasPermissions ? (
        <>
          <NavigationView
            style={{ flex: 1 }}
            onNavigationViewControllerCreated={() => {}}
            onMapViewControllerCreated={() => {}}
          />
          <View className="absolute bottom-10 w-full flex-row justify-evenly px-4">
            <Button title="Start" onPress={startGuidance} />
            <Button title="Stop" onPress={stopGuidance} />
          </View>
        </>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg font-semibold">
            Waiting for permissions...
          </Text>
        </View>
      )}
    </View>
  );
};

export default NavigationScreen;
