import DashboardScreen from "@/components/Screens/DashboardScreen";
import { View, StyleSheet } from "react-native";

export default function Tab() {
  return (
    <View style={styles.container}>
      <DashboardScreen/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
