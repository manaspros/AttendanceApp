import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCourseContext } from "../store/context/course-context";
import { saveData, getData } from "../utils/storage"; // Import saveData and getData
import {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
  ButtonGroup,
} from "../../components/ui/button";
import { useFonts, AdventPro_700Bold } from "@expo-google-fonts/advent-pro";

const HomeScreen = ({ navigation }) => {
  const { selectedCourses, selectCategory } = useCourseContext();
  const [degree, setDegree] = useState(null); // New state to store the selected degree

  // Load the selected degree from AsyncStorage when the component mounts
  useEffect(() => {
    const loadDegree = async () => {
      const storedDegree = await getData("selectedDegree");
      setDegree(storedDegree);
    };
    loadDegree();
  }, []);

  // Handle course category selection
  const handleSelectCategory = async (category) => {
    selectCategory(category); // Update context
    setDegree(category); // Update local state

    // Save the selected degree to AsyncStorage
    await saveData("selectedDegree", category);

    navigation.navigate("MarkAttendance");
  };

  let [fontsLoaded] = useFonts({
    AdventPro_700Bold,
  });

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Select Degree</Text>

      {/* Buttons for selecting Degree */}
      <View style={styles.degreeButton}>
        <View style={styles.selectedCourses}>
          <Button
            size="md"
            variant="outline"
            action="primary"
            onPress={() => handleSelectCategory("CSE")}
          >
            <ButtonText>CSE</ButtonText>
          </Button>
        </View>
        <View style={styles.selectedCourses}>
          <Button
            size="md"
            variant="outline"
            action="primary"
            onPress={() => handleSelectCategory("DSAI")}
          >
            <ButtonText>DSAI</ButtonText>
          </Button>
        </View>
        <View style={styles.selectedCourses}>
          <Button
            size="md"
            variant="outline"
            action="primary"
            onPress={() => handleSelectCategory("ECE")}
          >
            <ButtonText>ECE</ButtonText>
          </Button>
        </View>
      </View>

      {/* Display the selected degree */}
      {degree && (
        <Text style={styles.selectedDegree}>
          {`Selected Degree: ${degree}`}
        </Text>
      )}

      {/* Display the courses if selected */}
      {selectedCourses.length > 0 && (
        <Text style={{ fontSize: 18, marginVertical: 20 }}>
          {`Selected Courses: \n ${selectedCourses.join("\n")}`}
        </Text>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  degreeButton: {
    marginVertical: 20,
  },
  selectedDegree: {
    fontSize: 18,
    marginVertical: 20,
    fontWeight: "bold",
    fontFamily: "AdventPro_700Bold",
  },
  selectedCourses: {
    fontSize: 18,
    marginVertical: 10,
  },
});
