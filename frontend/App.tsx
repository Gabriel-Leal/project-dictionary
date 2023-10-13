// Import necessary modules from React and React Native libraries
import React from "react";
import { StatusBar } from "react-native";

// Import the NativeBaseProvider for UI components from native-base
import { NativeBaseProvider } from "native-base";

// Import the Roboto fonts from the Expo Google Fonts project
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

// Import your custom theme settings, routing configuration, and authentication context
// import { Loading } from "@components/Loading"; // Loading component import (commented out)
import { THEME } from "./src/theme";
import { Routes } from "./src/routes";
import { AuthContextProvider } from "./src/contexts/AuthContext";

// Define the main App component
export default function App() {
  // Load the Roboto fonts and store the loading state in the fontsLoaded variable
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  // Render the app's components
  return (
    // Wrap everything in the NativeBaseProvider to access the UI components and custom theme
    <NativeBaseProvider theme={THEME}>
      {/*  Provide authentication context to child components */}
      <AuthContextProvider>
        {/* Render the main Routes component (which handles navigation) */}
        <Routes />
      </AuthContextProvider>
      {/* Configure and display the StatusBar of the application */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
    </NativeBaseProvider>
  );
}
