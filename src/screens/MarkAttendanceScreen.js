import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useCourseContext } from "../store/context/course-context";
import { getData } from "../utils/storage"; // assuming getData fetches from storage
import { MaterialIcons } from "@expo/vector-icons"; // Icon package for better visuals

const MarkAttendanceScreen = ({ navigation }) => {
  const { selectedCourses } = useCourseContext();
  const [attendance, setAttendance] = useState({});

  // Load attendance data on component mount
  useEffect(() => {
    const loadAttendance = async () => {
      const storedAttendance = await getData("attendance");

      if (storedAttendance) {
        const updatedAttendance = selectedCourses.reduce((acc, course) => {
          acc[course] = storedAttendance[course] || {
            attendancePercentage: "N/A",
          };
          return acc;
        }, {});
        setAttendance(updatedAttendance);
      } else {
        const initialAttendance = selectedCourses.reduce((acc, course) => {
          acc[course] = { attendancePercentage: "100.00" };
          return acc;
        }, {});
        setAttendance(initialAttendance);
      }
    };

    loadAttendance();
  }, [selectedCourses]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Courses</Text>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false} // Remove scrollbar
      >
        <Text style={styles.subtitle}>Attendance Percentages</Text>
        {selectedCourses.length > 0 ? (
          selectedCourses.map((course, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate("Attendance", { course })}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <MaterialIcons name="book" size={24} color="#4e54c8" />
                <Text style={styles.courseName}>{course}</Text>
              </View>
              <Text style={styles.attendanceText}>
                Attendance Percentage:{" "}
                {attendance[course]?.attendancePercentage
                  ? `${parseFloat(
                      attendance[course]?.attendancePercentage
                    ).toFixed(2)}%`
                  : "N/A"}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noCoursesText}>
            No selected courses available.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f8ff", // Light pastel background (soft blue shade)
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4e54c8", // Deep blue for contrast
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333", // Neutral dark for readability
    marginBottom: 15,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff", // White for a clean card look
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    borderColor: "#e0e0e0", // Subtle border
    borderWidth: 1,
    elevation: 3, // Shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3, // Subtle shadow on iOS
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  courseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4e54c8", // Matching accent color
    marginLeft: 10,
  },
  attendanceText: {
    fontSize: 16,
    color: "#555", // Neutral gray for details
  },
  noCoursesText: {
    fontSize: 18,
    color: "#666",
    marginVertical: 20,
    textAlign: "center",
  },
});

export default MarkAttendanceScreen;
