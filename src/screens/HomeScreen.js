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
import { LinearGradient } from "expo-linear-gradient";

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={["#3E4A89", "#1C1F33"]} // Deep blue gradient
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Select Your Degree</Text>

        {/* Buttons for selecting Degree */}
        <View style={styles.degreeButtonContainer}>
          <Button
            size="md"
            variant="outline"
            action="primary"
            onPress={() => handleSelectCategory("CSE")}
            style={styles.button}
          >
            <ButtonText>CSE</ButtonText>
          </Button>
          <Button
            size="md"
            variant="outline"
            action="primary"
            onPress={() => handleSelectCategory("DSAI")}
            style={styles.button}
          >
            <ButtonText>DSAI</ButtonText>
          </Button>
          <Button
            size="md"
            variant="outline"
            action="primary"
            onPress={() => handleSelectCategory("ECE")}
            style={styles.button}
          >
            <ButtonText>ECE</ButtonText>
          </Button>
        </View>

        {/* Display the selected degree */}
        {degree && (
          <Text style={styles.selectedDegree}>
            {`Selected Degree: ${degree}`}
          </Text>
        )}

        {/* Display the courses if selected */}
        {selectedCourses.length > 0 && (
          <View style={styles.courseCard}>
            <Text style={styles.courseCardTitle}>Selected Courses:</Text>
            {selectedCourses.map((course, index) => (
              <Text key={index} style={styles.courseItem}>
                {`• ${course}`}
              </Text>
            ))}
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 30,
    fontFamily: "AdventPro_700Bold",
  },
  degreeButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#6C63FF",
    borderWidth: 0,
    borderRadius: 10,
    paddingVertical: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  selectedDegree: {
    fontSize: 20,
    color: "#6C63FF",
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    fontFamily: "AdventPro_700Bold",
  },
  courseCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    width: "100%",
    marginTop: 20,
  },
  courseCardTitle: {
    fontSize: 20,
    color: "#3E4A89",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "AdventPro_700Bold",
  },
  courseItem: {
    fontSize: 18,
    color: "#333",
    marginVertical: 5,
    textAlign: "left",
    fontFamily: "AdventPro_700Bold",
  },
});
