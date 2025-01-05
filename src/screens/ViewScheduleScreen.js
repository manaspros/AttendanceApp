import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Agenda } from "react-native-calendars";
import courseSchedules from "../store/course-schedule";

const holidayDates = [
  "2025-01-13",
  "2025-01-26",
  "2025-02-26",
  "2025-03-14",
  "2025-03-25",
  "2025-03-31",
  "2025-04-06",
  "2025-04-10",
  "2025-04-14",
  "2025-04-18",
  "2025-05-12",
];

const ViewScheduleScreen = ({ route }) => {
  const { selectedCourses = [] } = route.params || {}; // Fallback to empty array if undefined
  const [agendaItems, setAgendaItems] = useState({});

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  // Define start and end dates for the Agenda
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 5); // 5 days before today
  const formattedStartDate = startDate.toISOString().split("T")[0];

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7); // 7 days after today
  const formattedEndDate = endDate.toISOString().split("T")[0];

  useEffect(() => {
    if (selectedCourses.length > 0) {
      const processedSchedule = processCourseSchedules(
        courseSchedules,
        selectedCourses,
        formattedStartDate,
        formattedEndDate
      );
      setAgendaItems(processedSchedule);
    } else {
      // Initialize agenda items with empty arrays for all dates
      const emptyAgenda = {};
      for (
        let date = new Date(formattedStartDate);
        date <= new Date(formattedEndDate);
        date.setDate(date.getDate() + 1)
      ) {
        const dateString = date.toISOString().split("T")[0];
        emptyAgenda[dateString] = [];
      }
      setAgendaItems(emptyAgenda);
    }
  }, [selectedCourses]);

  const processCourseSchedules = (
    schedules,
    selectedCourses,
    startDate,
    endDate
  ) => {
    const result = {};
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    selectedCourses.forEach((course) => {
      const schedule = schedules[course];
      const courseStartDate = new Date(schedule.startDate);
      const courseEndDate = new Date(schedule.endDate);

      for (
        let date = new Date(courseStartDate);
        date <= courseEndDate && date <= new Date(endDate);
        date.setDate(date.getDate() + 1)
      ) {
        const dateString = date.toISOString().split("T")[0];
        const dayName = daysOfWeek[date.getDay()];

        // Exclude weekends unless they are holidays
        if (
          (dayName === "Saturday" || dayName === "Sunday") &&
          !holidayDates.includes(dateString)
        ) {
          continue;
        }

        if (schedule[dayName]) {
          const courseTimes = Array.isArray(schedule[dayName])
            ? schedule[dayName]
            : [schedule[dayName]];

          courseTimes.forEach((timeSlot) => {
            const time = timeSlot.time || `Period ${timeSlot.period}`;
            const parsedTime = parseTime(time);

            if (!result[dateString]) {
              result[dateString] = [];
            }

            result[dateString].push({
              name: course,
              time,
              parsedTime,
            });
          });
        }
      }
    });

    // Sort items for each date by parsedTime (earliest first)
    Object.keys(result).forEach((date) => {
      result[date].sort((a, b) => a.parsedTime - b.parsedTime);
    });

    return result;
  };

  const parseTime = (time) => {
    const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (match) {
      let [_, hours, minutes, period] = match;
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);

      // Convert to 24-hour format
      if (period.toUpperCase() === "PM" && hours !== 12) {
        hours += 12;
      } else if (period.toUpperCase() === "AM" && hours === 12) {
        hours = 0;
      }

      return hours * 60 + minutes; // Return the time in minutes past midnight
    }
    return 24 * 60;
  };

  const renderAgendaItem = (item, firstItem) => (
    <View style={[styles.itemContainer, firstItem && { marginTop: 20 }]}>
      <Text style={styles.courseName}>{item.name}</Text>
      <Text style={styles.courseTime}>{item.time}</Text>
    </View>
  );

  const renderEmptyDate = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();

    if (holidayDates.includes(dateString)) {
      return (
        <View style={styles.emptyDateContainer}>
          <Text style={styles.emptyDateText}>Holiday</Text>
        </View>
      );
    }

    if (dayOfWeek === 6 || dayOfWeek === 0) {
      return (
        <View style={styles.emptyDateContainer}>
          <Text style={styles.emptyDateText}>No class today</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.emptyDateContainer}>
          <Text style={styles.emptyDateText}>No classes scheduled</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={agendaItems}
        renderItem={renderAgendaItem}
        renderEmptyDate={renderEmptyDate}
        selected={today}
        minDate={formattedStartDate}
        maxDate={formattedEndDate}
        theme={{
          agendaDayTextColor: "blue",
          agendaDayNumColor: "blue",
          agendaTodayColor: "red",
          agendaKnobColor: "blue",
        }}
        style={styles.agendaContainer}
        hideKnob={true} // Add this line
        markedDates={{
          ...Array.from({
            length:
              (new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24) +
              1,
          }).reduce((acc, _, index) => {
            const date = new Date(
              new Date(startDate).setDate(new Date(startDate).getDate() + index)
            )
              .toISOString()
              .split("T")[0];
            const dayOfWeek = new Date(date).getDay();

            if (
              (dayOfWeek >= 1 && dayOfWeek <= 5) || // Weekdays
              holidayDates.includes(date) // Include holidays
            ) {
              acc[date] = {
                marked: true,
                dotColor: holidayDates.includes(date) ? "green" : "blue",
              };
            }
            return acc;
          }, {}),
          ...holidayDates.reduce((acc, date) => {
            acc[date] = {
              selected: true,
              marked: true,
              selectedColor: "green",
              dotColor: "white",
              selectedTextColor: "white",
            };
            return acc;
          }, {}),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  agendaContainer: {
    minHeight: 300,
  },
  itemContainer: {
    backgroundColor: "#f9f9f9",
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 60,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  courseTime: {
    fontSize: 14,
    color: "gray",
  },
  emptyDateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  emptyDateText: {
    fontSize: 16,
    color: "gray",
  },
});

export default ViewScheduleScreen;
