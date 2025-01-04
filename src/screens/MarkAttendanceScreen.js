import React, { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity, Alert } from "react-native";
import { useCourseContext } from "../store/context/course-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getData } from "../utils/storage"; // Import AsyncStorage utilities
import courseSchedules from "../store/course-schedule"; // Import course schedules

const MarkAttendanceScreen = ({ navigation }) => {
  const { selectedCourses } = useCourseContext();
  const [attendance, setAttendance] = useState({});
  // Set default start date (2nd January) and end date (20th May)
  const [startDate, setStartDate] = useState(new Date(2024, 0, 2)); // Default 2nd Jan
  const [endDate, setEndDate] = useState(new Date(2024, 4, 20)); // Default 20th May
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [attendancePercentages, setAttendancePercentages] = useState({});

  // Load attendance data on component mount
  useEffect(() => {
    const loadAttendance = async () => {
      const storedAttendance = await getData("attendance");
      setAttendance(storedAttendance || {});
    };
    loadAttendance();
  }, []);

  // Calculate attendance percentage for a specific course
  const calculateAttendancePercentage = (course, startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const schedule = courseSchedules[course];
    if (!schedule) return 0;

    let totalScheduledClasses = 0;
    let totalPresentClasses = 0;

    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split("T")[0];
      const dayOfWeek = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

      // Check if there are scheduled classes on the current day
      if (schedule[dayOfWeek]) {
        totalScheduledClasses += schedule[dayOfWeek]; // Add the scheduled classes for this day
        const attendanceForDate = attendance[dateString]?.[course] || {};
        const presentCount = Object.values(attendanceForDate).filter(
          (status) => status === "Present"
        ).length;
        totalPresentClasses += presentCount; // Count the "Present" status
      }

      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return totalScheduledClasses > 0
      ? ((totalPresentClasses / totalScheduledClasses) * 100).toFixed(2) // Calculate attendance percentage
      : 0;
  };

  // Update percentages for all courses
  const updateAttendancePercentages = () => {
    if (!startDate || !endDate) {
      Alert.alert("Please select both start and end dates.");
      return;
    }

    const newPercentages = {};
    selectedCourses.forEach((course) => {
      newPercentages[course] = calculateAttendancePercentage(
        course,
        startDate,
        endDate
      );
    });
    setAttendancePercentages(newPercentages);
  };

  // Handle date selection
  const handleDateChange = (event, selectedDate, isStart) => {
    if (isStart) {
      setShowStartPicker(false);
      if (selectedDate) setStartDate(selectedDate);
    } else {
      setShowEndPicker(false);
      if (selectedDate) setEndDate(selectedDate);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Courses</Text>

      {/* Date Pickers */}
      <View style={{ marginVertical: 10 }}>
        <Button
          title={`Select Start Date: ${
            startDate ? startDate.toDateString() : "Not Selected"
          }`}
          onPress={() => setShowStartPicker(true)}
        />
        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) =>
              handleDateChange(event, selectedDate, true)
            }
          />
        )}
        <Button
          title={`Select End Date: ${
            endDate ? endDate.toDateString() : "Not Selected"
          }`}
          onPress={() => setShowEndPicker(true)}
        />
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) =>
              handleDateChange(event, selectedDate, false)
            }
          />
        )}
      </View>

      <Button
        title="Calculate Attendance"
        onPress={updateAttendancePercentages}
      />

      {/* Display Courses */}
      {selectedCourses.length > 0 ? (
        selectedCourses.map((course, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate("Attendance", { course })}
            style={{
              backgroundColor: "#f0f0f0",
              padding: 15,
              marginVertical: 5,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 18 }}>{course}</Text>
            <Text style={{ fontSize: 16, color: "gray" }}>
              Attendance: {attendancePercentages[course] || 0}%
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{ fontSize: 18, marginVertical: 20 }}>
          No courses selected.
        </Text>
      )}
    </View>
  );
};

export default MarkAttendanceScreen;
