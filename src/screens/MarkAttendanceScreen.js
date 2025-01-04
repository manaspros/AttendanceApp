import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useCourseContext } from "../store/context/course-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getData } from "../utils/storage"; // Import AsyncStorage utilities
import courseSchedules from "../store/course-schedule"; // Import course schedules
import { Button, ButtonText } from "../../components/ui/button";

const MarkAttendanceScreen = ({ navigation }) => {
  const { selectedCourses } = useCourseContext();
  const [attendance, setAttendance] = useState({});
  const [startDate, setStartDate] = useState(new Date(2024, 0, 2)); // Default 2nd Jan
  const [endDate, setEndDate] = useState(new Date(2024, 4, 20)); // Default 20th May
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [attendancePercentages, setAttendancePercentages] = useState({});

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
    let totalAbsentClasses = 0; // Track absences

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

        // Get attendance for the current day and course
        const attendanceForDate = attendance[dateString]?.[course] || null;
        if (attendanceForDate === "Absent") {
          totalAbsentClasses += 1; // Increment absent count
        }
      }

      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    const totalPresentClasses = totalScheduledClasses - totalAbsentClasses; // Calculate the present classes
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
      if (courseSchedules[course]) {
        // Only calculate attendance for courses with schedules
        newPercentages[course] = calculateAttendancePercentage(
          course,
          startDate,
          endDate
        );
      }
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

  // Filter scorable courses (those with available schedules)
  const scorableCourses = selectedCourses.filter(
    (course) => courseSchedules[course]
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Courses</Text>

      {/* Date Pickers */}
      {/* <View style={{ marginVertical: 10 }}>
        <Button
          size="lg"
          variant="solid"
          action="primary"
          onPress={() => setShowStartPicker(true)}
        >
          <ButtonText>
            Select Start Date:{" "}
            {startDate ? startDate.toDateString() : "Not Selected"}
          </ButtonText>
        </Button>
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
          size="lg"
          variant="solid"
          action="primary"
          onPress={() => setShowEndPicker(true)}
        >
          <ButtonText>
            Select End Date: {endDate ? endDate.toDateString() : "Not Selected"}
          </ButtonText>
        </Button>
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
        size="lg"
        variant="outline"
        action="primary"
        onPress={updateAttendancePercentages}
      >
        <ButtonText>Update Attendance Percentages</ButtonText>
      </Button> */}

      {/* Display Scorable Courses */}
      <ScrollView style={{ marginTop: 20 }}>
        {scorableCourses.length > 0 ? (
          scorableCourses.map((course, index) => (
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
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ fontSize: 18, marginVertical: 20 }}>
            No scorable courses available.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default MarkAttendanceScreen;
