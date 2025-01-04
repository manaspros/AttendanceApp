import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useRoute } from "@react-navigation/native";
import { saveData, getData } from "../utils/storage";
import courseSchedules from "../store/course-schedule"; // Import the course schedules
import courseHolidays from "../store/course-holiday"; // Import the course holidays
import {
  Table,
  TableHeader,
  TableFooter,
  TableBody,
  TableHead,
  TableData,
  TableRow,
  TableCaption,
} from "../../components/ui/table";

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
    };
    loadAttendance();
  }, []);

  useEffect(() => {
    markScheduledDates(attendance);
  }, [attendance]);

  const [lastUpdated, setLastUpdated] = useState(null);

  const getLastUpdatedForCourse = () => {
    return attendance.lastUpdated?.[course]
      ? new Date(attendance.lastUpdated[course]).toLocaleString()
      : "Not updated yet";
  };

  const getCourseDates = (course) => {
    const courseData = courseSchedules[course] || {};
    const endDate = courseData.endDate || defaultEndDate;
    const startDate = courseData.startDate || defaultStartDate;
    return {
      start: new Date(startDate),
      end: new Date(endDate),
    };
  };

  const markScheduledDates = (attendanceData) => {
    const newMarkedDates = {};
    const schedule = courseSchedules[course] || {};
    const holidays = courseHolidays[course] || [];
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
          let backgroundColor = "green";
          if (classes === 1) {
            backgroundColor = "#90ee90"; // Light green for 1 class
          } else if (classes === 2) {
            backgroundColor = "#32cd32"; // Darker green for 2 classes
          }
          newMarkedDates[dateString] = {
            customStyles: {
              container: {
                backgroundColor: absentCount > 0 ? "red" : backgroundColor,
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

    // Add last updated date for the course
    const lastUpdated = new Date().toISOString();
    currentAttendance.lastUpdated = currentAttendance.lastUpdated || {};
    currentAttendance.lastUpdated[course] = lastUpdated;

    // Calculate attendance percentage
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
            if (
              !courseHolidays[course]?.includes(
                currentDate.toISOString().split("T")[0]
              )
            ) {
              count += classes;
            }
          }
        }

        return acc + count;
      },
      0
    );

    const absentCount = Object.keys(currentAttendance).reduce((acc, date) => {
      const dayOfWeek = getDayOfWeek(date);
      const classesOnDay = courseSchedules[course]?.[dayOfWeek] || 0;
      const absentForDay = Object.values(
        currentAttendance[date]?.[course] || {}
      ).filter((status) => status === "Absent").length;

      return acc + Math.min(absentForDay, classesOnDay);
    }, 0);

    const currentAttendancePercentage =
      ((totalClasses - absentCount) / totalClasses) * 100;

    // Store the attendance percentage with the course data
    currentAttendance[course] = currentAttendance[course] || {};
    currentAttendance[course].attendancePercentage =
      currentAttendancePercentage;

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

            if (updatedAttendance.lastUpdated) {
              delete updatedAttendance.lastUpdated[course];
            }

            // Calculate and reset attendance percentage
            const totalClasses = Object.entries(
              courseSchedules[course] || {}
            ).reduce((acc, [dayOfWeek, classes]) => {
              const { start, end } = getCourseDates(course);
              let count = 0;

              for (
                let currentDate = new Date(start);
                currentDate <= end;
                currentDate.setDate(currentDate.getDate() + 1)
              ) {
                if (
                  getDayOfWeek(currentDate.toISOString().split("T")[0]) ===
                  dayOfWeek
                ) {
                  if (
                    !courseHolidays[course]?.includes(
                      currentDate.toISOString().split("T")[0]
                    )
                  ) {
                    count += classes;
                  }
                }
              }

              return acc + count;
            }, 0);

            const absentCount = 0; // Reset absent count
            const currentAttendancePercentage =
              ((totalClasses - absentCount) / totalClasses) * 100;

            // Store the attendance percentage with the course data
            updatedAttendance[course] = updatedAttendance[course] || {};
            updatedAttendance[course].attendancePercentage =
              currentAttendancePercentage;

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
          if (
            !courseHolidays[course]?.includes(
              currentDate.toISOString().split("T")[0]
            )
          ) {
            count += classes;
          }
        }
      }

      return acc + count;
    },
    0
  );

  const minRequiredClasses = Math.ceil(totalClasses * 0.75);
  const allowableAbsences = totalClasses - minRequiredClasses - absentCount;
  const currentAttendancePercentage =
    ((totalClasses - absentCount) / totalClasses) * 100;

  return (
    <ScrollView style={{ marginTop: 20, flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Mark Attendance</Text>
        <Text style={styles.subtitle}>
          Mark attendance for: {"\n"} {course}
        </Text>

        <Calendar
          onDayPress={(day) => handleDateSelect(day)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "blue" },
            ...markedDates,
          }}
          markingType="custom"
          minDate={getCourseDates(course).start.toISOString().split("T")[0]}
          maxDate={getCourseDates(course).end.toISOString().split("T")[0]}
        />

        <View style={styles.legendContainer}>
          <Text style={styles.legendItem}>
            <View style={styles.oneClass} /> 1 Class
          </Text>
          <Text style={styles.legendItem}>
            <View style={styles.greenDark} /> 2 Classes
          </Text>
          <Text style={styles.legendItem}>
            <View style={styles.red} /> Absent for Class
          </Text>
          <Text style={styles.legendItem}>
            <View style={styles.orange} /> Not Marked
          </Text>
          <Text style={styles.legendItem}>
            <View style={styles.gray} /> Holiday
          </Text>
        </View>

        <View style={{ flex: 1, marginBottom: 40 }}>
          <Table className="w-full">
            <TableBody>
              <TableRow>
                <TableData>Total Classes Scheduled:</TableData>
                <TableData>{totalClasses}</TableData>
              </TableRow>
              <TableRow>
                <TableData>Total Classes Attended:</TableData>
                <TableData>{presentCount}</TableData>
              </TableRow>
              <TableRow>
                <TableData>Absent Left</TableData>
                <TableData>{Math.max(allowableAbsences, 0)}</TableData>
              </TableRow>
              <TableRow>
                <TableData>Attendance Percentage:</TableData>
                <TableData>{currentAttendancePercentage.toFixed(2)}%</TableData>
              </TableRow>
              <TableRow>
                <TableData>Last Updated:</TableData>
                <TableData>{getLastUpdatedForCourse()}</TableData>
              </TableRow>
            </TableBody>
          </Table>
        </View>

        {selectedDate && ( // Conditionally render buttons only if a date is selected
          <View style={styles.floatingButtons}>
            <TouchableOpacity
              style={styles.presentButton}
              onPress={() => handleMarkAllClasses("Present")}
            >
              <Text style={styles.buttonText}>Present for Class</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.absentButton}
              onPress={() => handleMarkAllClasses("Absent")}
            >
              <Text style={styles.buttonText}>Absent for Class</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Reset Attendance"
            onPress={handleResetAttendance}
            color="red"
          />
        </View>
      </View>
    </ScrollView>
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
  legendContainer: {
    position: "absolute",
    top: 5,
    right: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 5,
    elevation: 2,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  oneClass: {
    width: 15,
    height: 15,
    backgroundColor: "#90ee90", // Light Green
    borderRadius: 5,
  },
  greenDark: {
    width: 15,
    height: 15,
    backgroundColor: "#32cd32", // Dark Green
    borderRadius: 5,
  },
  red: {
    width: 15,
    height: 15,
    backgroundColor: "red",
    borderRadius: 5,
  },
  orange: {
    width: 15,
    height: 15,
    backgroundColor: "orange",
    borderRadius: 5,
  },
  gray: {
    width: 15,
    height: 15,
    backgroundColor: "gray",
    borderRadius: 5,
  },
  floatingButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
  },
  presentButton: {
    backgroundColor: "#32cd32",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  absentButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default AttendanceScreen;
