import React from "react";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/screens/HomeScreen";
import MarkAttendanceScreen from "./src/screens/MarkAttendanceScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CourseProvider } from "./src/store/context/course-context";
import AttendanceScreen from "./src/screens/AttendanceScreen";
import ViewScheduleScreen from "./src/screens/ViewScheduleScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GluestackUIProvider mode="light">
      <CourseProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "#6C63FF", // Vibrant purple background for the navbar
              },
              headerTintColor: "#FFFFFF", // White text color for titles
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 20,
                fontFamily: "AdventPro_700Bold", // Aesthetic font
              },
              headerShadowVisible: false, // Removes shadow for a cleaner look
              headerBackTitleVisible: false, // Hides "Back" text
              animationDuration: 1000, // Duration of the animation (slower than default)
              gestureEnabled: true, // Enable gesture navigation for smoother experience
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
                title: "Mark Attendance", // Custom title for the screen
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
