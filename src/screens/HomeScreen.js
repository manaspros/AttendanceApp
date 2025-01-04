import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { useCourseContext } from "../store/context/course-context";
import { saveData, getData } from "../utils/storage"; // Import saveData and getData

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

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Select Degree</Text>

      {/* Buttons for selecting Degree */}
      <Button
        title="Degree 1"
        onPress={() => handleSelectCategory("Degree 1")}
      />
      <Button
        title="Degree 2"
        onPress={() => handleSelectCategory("Degree 2")}
      />
      <Button
        title="Degree 3"
        onPress={() => handleSelectCategory("Degree 3")}
      />

      {/* Display the selected degree */}
      {degree && (
        <Text style={{ fontSize: 18, marginVertical: 20 }}>
          {`Selected Degree: ${degree}`}
        </Text>
      )}

      {/* Display the courses if selected */}
      {selectedCourses.length > 0 && (
        <Text style={{ fontSize: 18, marginVertical: 20 }}>
          {`Selected Courses: ${selectedCourses.join(", ")}`}
        </Text>
      )}
    </View>
  );
};

export default HomeScreen;
