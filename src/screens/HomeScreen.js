import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useCourseContext } from "../store/context/course-context";
import { saveData, getData } from "../utils/storage";
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
  const [degree, setDegree] = useState(null);

  useEffect(() => {
    const loadDegree = async () => {
      const storedDegree = await getData("selectedDegree");
      setDegree(storedDegree);
    };
    loadDegree();
  }, []);

  const handleSelectCategory = async (category) => {
    selectCategory(category);
    setDegree(category);
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
    <LinearGradient colors={["#3E4A89", "#1C1F33"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Your Degree</Text>

          {/* Buttons for selecting Degree */}
          <View style={styles.degreeButtonContainer}>
            <View style={styles.buttonWrapper}>
              <Button
                size="md"
                variant="outline"
                action="primary"
                onPress={() => handleSelectCategory("CSE")}
                style={styles.button}
              >
                <Text style={styles.buttonText}>CSE</Text>
              </Button>
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                size="md"
                variant="outline"
                action="primary"
                onPress={() => handleSelectCategory("DSAI")}
                style={styles.button}
              >
                <Text style={styles.buttonText}>DSAI</Text>
              </Button>
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                size="md"
                variant="outline"
                action="primary"
                onPress={() => handleSelectCategory("ECE")}
                style={styles.button}
              >
                <Text style={styles.buttonText}>ECE</Text>
              </Button>
            </View>
          </View>

          {degree && (
            <Text style={styles.selectedDegree}>
              {`Selected Degree: ${degree}`}
            </Text>
          )}

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
      </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
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
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
    height: 50,
    borderRadius: 20,
    overflow: "hidden", // Ensures rounded corners look consistent
  },
  button: {
    flex: 1,
    backgroundColor: "#6C63FF", // Vibrant purple button
    paddingHorizontal: 20,
    paddingVertical: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF", // White text for contrast
    fontWeight: "600",
    fontFamily: "AdventPro_700Bold",
  },
  selectedDegree: {
    fontSize: 20,
    color: "#FFD700", // Golden text color
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
