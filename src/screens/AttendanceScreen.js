import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useRoute } from "@react-navigation/native";
import { saveData, getData } from "../utils/storage";
import courseSchedules from "../store/course-schedule"; // Import the course schedules

const AttendanceScreen = ({ navigation }) => {
  const route = useRoute();
  const { course } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [markedDates, setMarkedDates] = useState({});

  // Define the range
  const startDate = "2025-01-02"; // 2nd January
  const endDate = "2025-05-21"; // 21st May

  // Helper to get the day of the week from a date
  const getDayOfWeek = (dateString) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  // Load attendance and mark scheduled dates
  useEffect(() => {
    const loadAttendance = async () => {
      const storedAttendance = await getData("attendance");
      setAttendance(storedAttendance || {});
      markScheduledDates(storedAttendance || {});
    };
    loadAttendance();
  }, []);

  const markScheduledDates = (attendanceData) => {
    const newMarkedDates = {};
    const schedule = courseSchedules[course] || {};

    const start = new Date(startDate);
    const end = new Date(endDate);

    for (
      let currentDate = new Date(start); // Create a new Date object to avoid mutation
      currentDate <= end;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const dateString = currentDate.toISOString().split("T")[0];
      const dayOfWeek = getDayOfWeek(dateString);

      if (schedule[dayOfWeek]) {
        const classes = schedule[dayOfWeek];
        const attendanceForDate = attendanceData[dateString]?.[course] || {};

        const absentCount = Object.values(attendanceForDate).filter(
          (status) => status === "Absent"
        ).length;

        if (Object.keys(attendanceForDate).length === 0) {
          // No attendance marked
          newMarkedDates[dateString] = {
            customStyles: {
              container: {
                backgroundColor: "orange",
              },
              text: { color: "white", fontWeight: "bold" },
            },
          };
        } else {
          // Mark as green if no absences, else red
          newMarkedDates[dateString] = {
            customStyles: {
              container: {
                backgroundColor: absentCount > 0 ? "red" : "green",
              },
              text: { color: "white", fontWeight: "bold" },
            },
          };
        }
      }
    }

    setMarkedDates(newMarkedDates);
  };

  // Handle selecting a date
  const handleDateSelect = (date) => {
    const dayOfWeek = getDayOfWeek(date.dateString);
    if (courseSchedules[course]?.[dayOfWeek]) {
      setSelectedDate(date.dateString);
    } else {
      Alert.alert("No classes scheduled for this course on this day.");
    }
  };

  // Mark attendance for all classes
  const handleMarkAllClasses = async (status) => {
    if (!selectedDate) {
      Alert.alert("Please select a valid date.");
      return;
    }

    const dayOfWeek = getDayOfWeek(selectedDate);
    const classesOnDay = courseSchedules[course]?.[dayOfWeek];

    if (!classesOnDay) {
      Alert.alert("No classes scheduled for this day.");
      return;
    }

    const currentAttendance = { ...attendance };
    if (!currentAttendance[selectedDate]) {
      currentAttendance[selectedDate] = {};
    }
    if (!currentAttendance[selectedDate][course]) {
      currentAttendance[selectedDate][course] = {};
    }

    // Mark all classes
    for (let i = 1; i <= classesOnDay; i++) {
      currentAttendance[selectedDate][course][`Class ${i}`] = status;
    }

    // Update state and persist data
    setAttendance(currentAttendance);
    await saveData("attendance", currentAttendance);

    // Recalculate marked dates
    markScheduledDates(currentAttendance);

    Alert.alert(`Marked ${status} for all classes on ${selectedDate}`);
  };

  // Reset attendance
  const handleResetAttendance = async () => {
    const updatedAttendance = { ...attendance };
    for (const date in updatedAttendance) {
      if (updatedAttendance[date]?.[course]) {
        delete updatedAttendance[date][course];
      }
    }

    setAttendance(updatedAttendance);
    await saveData("attendance", updatedAttendance);

    // Recalculate marked dates
    markScheduledDates(updatedAttendance);

    Alert.alert("Attendance reset for the course.");
  };

  const presentCount = Object.keys(attendance).reduce((acc, date) => {
    const dayOfWeek = getDayOfWeek(date);
    const classesOnDay = courseSchedules[course]?.[dayOfWeek] || 0;
    const presentForDay = Object.values(
      attendance[date]?.[course] || {}
    ).filter((status) => status === "Present").length;

    return acc + Math.min(presentForDay, classesOnDay);
  }, 0);

  const totalClasses = Object.keys(attendance).reduce((acc, date) => {
    const dayOfWeek = getDayOfWeek(date);
    const classesOnDay = courseSchedules[course]?.[dayOfWeek] || 0;

    return acc + classesOnDay;
  }, 0);

  const totalScheduledClasses = Object.entries(
    courseSchedules[course] || {}
  ).reduce((acc, [dayOfWeek, classes]) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;

    for (
      let currentDate = new Date(start);
      currentDate <= end;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      if (getDayOfWeek(currentDate.toISOString().split("T")[0]) === dayOfWeek) {
        count += classes;
      }
    }

    return acc + count;
  }, 0);

  const minRequiredClasses = Math.ceil(totalScheduledClasses * 0.75);
  const allowableAbsences =
    totalScheduledClasses - minRequiredClasses - presentCount;
  const currentAttendancePercentage =
    (presentCount / totalScheduledClasses) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>
      <Text style={styles.subtitle}>Mark attendance for: {course}</Text>

      {/* Calendar */}
      <Calendar
        onDayPress={(day) => handleDateSelect(day)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "blue" },
          ...markedDates,
        }}
        markingType="custom"
        minDate={startDate} // Set the minimum date
        maxDate={endDate} // Set the maximum date
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Present for All Classes"
          onPress={() => handleMarkAllClasses("Present")}
        />
        <Button
          title="Absent for All Classes"
          onPress={() => handleMarkAllClasses("Absent")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Reset Attendance"
          onPress={handleResetAttendance}
          color="red"
        />
      </View>

      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View>
        <Text>
          Attendance Summary: {presentCount}/{totalClasses} classes attended
        </Text>
        <Text>
          You can leave {Math.max(allowableAbsences, 0)} more classes to
          maintain 75% attendance.
        </Text>
        {currentAttendancePercentage < 75 && (
          <Text style={{ color: "red", fontWeight: "bold", marginTop: 10 }}>
            Critical Alert: Your attendance is below 75%. You are at risk of
            falling short of the required minimum attendance!
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AttendanceScreen;
