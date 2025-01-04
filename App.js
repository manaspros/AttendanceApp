import React from "react";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/screens/HomeScreen";
import MarkAttendanceScreen from "./src/screens/MarkAttendanceScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CourseProvider } from "./src/store/context/course-context";
import AttendanceScreen from "./src/screens/AttendanceScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GluestackUIProvider mode="light"><CourseProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="MarkAttendance"
              component={MarkAttendanceScreen}
            />
            <Stack.Screen name="Attendance" component={AttendanceScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CourseProvider></GluestackUIProvider>
  );
};

export default App;
