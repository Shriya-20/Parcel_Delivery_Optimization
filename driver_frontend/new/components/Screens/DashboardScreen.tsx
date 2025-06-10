"use client";

import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Surface, Switch, Button, Badge } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
// import { requestLocationPermission } from "../../services/LocationService";
// import { requestNotificationPermission } from "../../services/NotificationService";
import DeliveryQueue from "../ui/DeliveryQueue";
// import NotificationBell from "../../components/NotificationBell";

const DashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
//   const [locationPermission, setLocationPermission] = useState(false);
//   const [notificationPermission, setNotificationPermission] = useState(false);

//   useEffect(() => {
//     const checkPermissions = async () => {
//       const locPerm = await requestLocationPermission();
//       setLocationPermission(locPerm);

//       const notifPerm = await requestNotificationPermission();
//       setNotificationPermission(notifPerm);
//     };

//     checkPermissions();
//   }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>
              Welcome back, {user?.name || "Driver"}
            </Text>
          </View>
          <View style={styles.headerActions}>
            {/* <NotificationBell /> */}
            <View style={styles.switchContainer}>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                color="#3b82f6"
              />
              <Text style={styles.switchLabel}>Available</Text>
            </View>
          </View>
        </View>

        <Surface style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Current Delivery Queue</Text>
            <Badge style={styles.badge}>5 Packages</Badge>
          </View>
          <DeliveryQueue navigation={navigation} />
        </Surface>

        <Surface style={styles.mapCard}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>Live Location Tracking</Text>
            <Text style={styles.mapSubtext}>
              Your current location is being shared
            </Text>
          </View>
          <View style={styles.mapOverlay}>
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>Current Area: Downtown</Text>
              <Text style={styles.locationSubtitle}>
                Next delivery: 0.8 miles away
              </Text>
            </View>
            <Button
              mode="contained"
              compact
              style={styles.recenterButton}
              icon="map-marker"
            >
              Recenter
            </Button>
          </View>
        </Surface>

        <Surface style={styles.alertCard}>
          <View style={styles.alertContent}>
            <MaterialCommunityIcons
              name="weather-pouring"
              size={24}
              color="#eab308"
            />
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Weather Alert</Text>
              <Text style={styles.alertDescription}>
                Heavy rain expected on your route between 2-4 PM. Plan
                accordingly.
              </Text>
            </View>
          </View>
        </Surface>

        <Surface style={styles.card}>
          <Text style={styles.cardTitle}>Daily Summary</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="package-variant"
                size={24}
                color="#3b82f6"
              />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={24}
                color="#3b82f6"
              />
              <Text style={styles.statValue}>$142</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color="#3b82f6"
              />
              <Text style={styles.statValue}>5.2</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="trending-up"
                size={24}
                color="#3b82f6"
              />
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>On-time</Text>
            </View>
          </View>
        </Surface>

        {/* {(!locationPermission || !notificationPermission) && (
          <Surface style={styles.permissionCard}>
            <Text style={styles.permissionTitle}>Enable Services</Text>
            {!locationPermission && (
              <Button
                mode="outlined"
                icon="map-marker"
                style={styles.permissionButton}
                onPress={() => requestLocationPermission()}
              >
                Enable Location Services
              </Button>
            )}
            {!notificationPermission && (
              <Button
                mode="outlined"
                icon="bell"
                style={styles.permissionButton}
                onPress={() => requestNotificationPermission()}
              >
                Enable Notifications
              </Button>
            )}
          </Surface>
        )} */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for bottom tab bar
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#6b7280",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  switchLabel: {
    marginLeft: 8,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "#f3f4f6",
    color: "#1f2937",
  },
  mapCard: {
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
  },
  mapPlaceholder: {
    height: 180,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  mapText: {
    color: "#6b7280",
  },
  mapSubtext: {
    color: "#6b7280",
    fontSize: 12,
  },
  mapOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationInfo: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 4,
    elevation: 2,
    flex: 1,
    marginRight: 8,
  },
  locationTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  locationSubtitle: {
    color: "#6b7280",
    fontSize: 12,
  },
  recenterButton: {
    height: 36,
  },
  alertCard: {
    backgroundColor: "#fef9c3",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  alertContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  alertTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  alertTitle: {
    fontWeight: "bold",
    color: "#854d0e",
  },
  alertDescription: {
    color: "#854d0e",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  statItem: {
    width: "50%",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginBottom: 8,
    marginRight: "2%",
    // width: "48%",
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  statLabel: {
    color: "#6b7280",
    fontSize: 12,
  },
  permissionCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  permissionButton: {
    marginBottom: 8,
  },
});

export default DashboardScreen;
