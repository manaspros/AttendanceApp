import React from "react";
import { StatusBar } from "react-native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/screens/HomeScreen";
import MarkAttendanceScreen from "./src/screens/MarkAttendanceScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CourseProvider } from "./src/store/context/course-context";
import AttendanceScreen from "./src/screens/AttendanceScreen";
import ViewScheduleScreen from "./src/screens/ViewScheduleScreen";
import { LinearGradient } from "expo-linear-gradient";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GluestackUIProvider mode="light">
      <CourseProvider>
        {/* Set Status Bar to dark */}
        <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "transparent", // Transparent to show gradient
              },
              headerTintColor: "#FFFFFF", // White text color for titles
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 20,
                fontFamily: "AdventPro_700Bold",
              },
              headerShadowVisible: false, // Removes shadow for a cleaner look
              headerBackTitleVisible: false, // Hides "Back" text
              animation: "slide_from_right", // Smooth fade animation
              gestureEnabled: true, // Enable gesture navigation
              headerBackground: () => (
                <LinearGradient
                  colors={["#6C63FF", "#807BFF"]} // Gradient for the navbar
                  style={{ flex: 1 }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              ),
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: "Welcome", // Custom title for the Home screen
                headerTitleAlign: "center", // Center-align the title
              }}
            />
            <Stack.Screen
              name="MarkAttendance"
              component={MarkAttendanceScreen}
              options={{
                title: "Mark Attendance",
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="ViewScheduleScreen"
              component={ViewScheduleScreen}
              options={{
                title: "View Schedule",
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="Attendance"
              component={AttendanceScreen}
              options={{
                title: "Attendance History",
                headerTitleAlign: "center",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CourseProvider>
    </GluestackUIProvider>
  );
};

export default App;
