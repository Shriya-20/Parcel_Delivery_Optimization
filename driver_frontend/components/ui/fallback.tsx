import React, { useEffect, useState } from "react";
import {
  NavigationProvider,
  TaskRemovedBehavior,
  TermsAndConditionsDialogOptions,
} from "@googlemaps/react-native-navigation-sdk";
import NavigationScreen from "./screens/NavigationScreen";

const termsAndConditionsDialogOptions: TermsAndConditionsDialogOptions = {
  title: "Terms and Conditions",
  companyName: "MyApp",
  showOnlyDisclaimer: true,
};

export default function App() {
  return (
    <NavigationProvider
      termsAndConditionsDialogOptions={termsAndConditionsDialogOptions}
      taskRemovedBehavior={TaskRemovedBehavior.CONTINUE_SERVICE}
    >
      <NavigationScreen />
    </NavigationProvider>
  );
}
