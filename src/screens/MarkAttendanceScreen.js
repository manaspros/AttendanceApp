import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useCourseContext } from "../store/context/course-context";
import { getData } from "../utils/storage"; // assuming getData fetches from storage

const MarkAttendanceScreen = ({ navigation }) => {
  const { selectedCourses } = useCourseContext();
  const [attendance, setAttendance] = useState({}); // Store attendance data

  // Load attendance data on component mount
  useEffect(() => {
    const loadAttendance = async () => {
      const storedAttendance = await getData("attendance"); // Fetch the latest attendance from storage

      if (storedAttendance) {
        // Update the attendance data from storage for each course
        const updatedAttendance = selectedCourses.reduce((acc, course) => {
          // Check if attendance for the course exists, otherwise set it as empty or default
          acc[course] = storedAttendance[course] || {
            attendancePercentage: "N/A",
          };
          return acc;
        }, {});

        // Set the state with updated attendance data
        setAttendance(updatedAttendance);
      } else {
        // If no attendance data is found in storage, initialize with "N/A" for each selected course
        const initialAttendance = selectedCourses.reduce((acc, course) => {
          acc[course] = { attendancePercentage: "100.00" }; // Default to 100.00%
          return acc;
        }, {});
        setAttendance(initialAttendance);
      }
    };

    loadAttendance();
  }, [selectedCourses]); // Reloads whenever selectedCourses change

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Courses</Text>
      <ScrollView style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
          Attendance Percentages
        </Text>
        {selectedCourses.length > 0 ? (
          selectedCourses.map((course, index) => (
            <TouchableOpacity
              key={index}
              onPress={
                () => navigation.navigate("Attendance", { course }) // Navigate to a detailed page
              }
              style={{
                backgroundColor: "#e6f7ff",
                padding: 15,
                marginVertical: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{course}</Text>
              <Text style={{ fontSize: 16 }}>
                Attendance Percentage:{" "}
                {attendance[course]?.attendancePercentage
                  ? `${parseFloat(
                      attendance[course]?.attendancePercentage
                    ).toFixed(2)}%`
                  : "100.00%"}{" "}
                {/* Show "N/A" if no data available */}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ fontSize: 18, marginVertical: 20 }}>
            No selected courses available.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default MarkAttendanceScreen;
