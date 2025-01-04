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
import courseHolidays from "../store/course-holiday"; // Import the course holidays

const AttendanceScreen = ({ navigation }) => {
  const route = useRoute();
  const { course } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [markedDates, setMarkedDates] = useState({});

  const defaultStartDate = "2025-01-02";
  const defaultEndDate = "2025-05-21";

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

  useEffect(() => {
    const loadAttendance = async () => {
      const storedAttendance = await getData("attendance");
      setAttendance(storedAttendance || {});
      markScheduledDates(storedAttendance || {});
    };
    loadAttendance();
  }, []);

  const getCourseDates = (course) => {
    const courseData = courseSchedules[course] || {};
    const endDate = courseData.endDate || defaultEndDate;
    const startDate = courseData.startDate || defaultEndDate; // Get custom endDate if exists
    return {
      start: new Date(startDate), // Use the course-specific start date
      end: new Date(endDate),
    };
  };

  const markScheduledDates = (attendanceData) => {
    const newMarkedDates = {};
    const schedule = courseSchedules[course] || {};
    const holidays = courseHolidays[course] || []; // Get holidays for the course
    const { start, end } = getCourseDates(course);

    for (
      let currentDate = new Date(start);
      currentDate <= end;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const dateString = currentDate.toISOString().split("T")[0];
      const dayOfWeek = getDayOfWeek(dateString);

      if (holidays.includes(dateString)) {
        newMarkedDates[dateString] = {
          customStyles: {
            container: {
              backgroundColor: "gray",
            },
            text: { color: "white", fontWeight: "bold" },
          },
        };
      } else if (schedule[dayOfWeek]) {
        const classes = schedule[dayOfWeek];
        const attendanceForDate = attendanceData[dateString]?.[course] || {};

        const absentCount = Object.values(attendanceForDate).filter(
          (status) => status === "Absent"
        ).length;

        if (Object.keys(attendanceForDate).length === 0) {
          newMarkedDates[dateString] = {
            customStyles: {
              container: {
                backgroundColor: "orange",
              },
              text: { color: "white", fontWeight: "bold" },
            },
          };
        } else {
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

  const handleDateSelect = (date) => {
    const dayOfWeek = getDayOfWeek(date.dateString);
    if (
      courseSchedules[course]?.[dayOfWeek] &&
      !courseHolidays[course]?.includes(date.dateString)
    ) {
      setSelectedDate(date.dateString);
    } else {
      Alert.alert("No classes scheduled or holiday on this day.");
    }
  };

  const handleMarkAllClasses = async (status) => {
    if (!selectedDate) {
      Alert.alert("Please select a valid date.");
      return;
    }

    if (courseHolidays[course]?.includes(selectedDate)) {
      Alert.alert("Attendance cannot be marked on a holiday.");
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

    for (let i = 1; i <= classesOnDay; i++) {
      currentAttendance[selectedDate][course][`Class ${i}`] = status;
    }

    setAttendance(currentAttendance);
    await saveData("attendance", currentAttendance);
    markScheduledDates(currentAttendance);

    Alert.alert(`Marked ${status} for all classes on ${selectedDate}`);
  };

  const handleResetAttendance = async () => {
    Alert.alert(
      "Reset Attendance",
      "Are you sure you want to reset the attendance for this course?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Reset cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            const updatedAttendance = { ...attendance };
            for (const date in updatedAttendance) {
              if (updatedAttendance[date]?.[course]) {
                delete updatedAttendance[date][course];
              }
            }

            setAttendance(updatedAttendance);
            await saveData("attendance", updatedAttendance);
            markScheduledDates(updatedAttendance);

            Alert.alert("Attendance reset for the course.");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const presentCount = Object.keys(attendance).reduce((acc, date) => {
    const dayOfWeek = getDayOfWeek(date);
    const classesOnDay = courseSchedules[course]?.[dayOfWeek] || 0;
    const presentForDay = Object.values(
      attendance[date]?.[course] || {}
    ).filter((status) => status === "Present").length;

    return acc + Math.min(presentForDay, classesOnDay);
  }, 0);

  const absentCount = Object.keys(attendance).reduce((acc, date) => {
    const dayOfWeek = getDayOfWeek(date);
    const classesOnDay = courseSchedules[course]?.[dayOfWeek] || 0;
    const absentForDay = Object.values(attendance[date]?.[course] || {}).filter(
      (status) => status === "Absent"
    ).length;

    return acc + Math.min(absentForDay, classesOnDay);
  }, 0);

  const totalClasses = Object.entries(courseSchedules[course] || {}).reduce(
    (acc, [dayOfWeek, classes]) => {
      const { start, end } = getCourseDates(course);
      let count = 0;

      for (
        let currentDate = new Date(start);
        currentDate <= end;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        if (
          getDayOfWeek(currentDate.toISOString().split("T")[0]) === dayOfWeek
        ) {
          // Check if this date is a holiday for the course
          if (
            !courseHolidays[course]?.includes(
              currentDate.toISOString().split("T")[0]
            )
          ) {
            count += classes; // Only add to count if it's not a holiday
          }
        }
      }

      return acc + count;
    },
    0
  );

  const minRequiredClasses = Math.ceil(totalClasses * 0.75);
  const allowableAbsences = totalClasses - minRequiredClasses - absentCount;
  const currentAttendancePercentage = (presentCount / totalClasses) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>
      <Text style={styles.subtitle}>Mark attendance for: {course}</Text>

      <Calendar
        onDayPress={(day) => handleDateSelect(day)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "blue" },
          ...markedDates,
        }}
        markingType="custom"
        minDate={getCourseDates(course).start.toISOString().split("T")[0]}
        maxDate={getCourseDates(course).end.toISOString().split("T")[0]} // Set maxDate for the specific course
      />

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
