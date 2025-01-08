const courseSchedules = {
  "Introduction to IoT": {
    startDate: "2025-01-03",
    Thursday: { period: 1, time: "12:00 PM - 1:00 PM" },
    Friday: { period: 1, time: "9:00 AM - 11:00 AM" },
    endDate: "2025-05-21",
  },
  "Design &Prototyping": {
    startDate: "2025-01-02",
    Wednesday: { period: 1, time: "10:00 AM - 11:00 AM" },
    Thursday: { period: 1, time: "9:00 AM - 11:00 AM" },
    endDate: "2025-05-21",
  },
  "3D Printing": {
    startDate: "2025-01-03",
    Monday: { period: 1, time: "4:00 PM - 6:00 PM" },
    Wednesday: { period: 1, time: "12:00 PM - 1:00 PM" },
    endDate: "2025-05-21",
  },
  "Introduction to AI and ML": {
    startDate: "2025-01-03",
    Monday: { period: 2, time: "2:00 PM - 4:00 PM \n 10:00 AM - 11:00 AM" },
    endDate: "2025-05-21",
  },
  "Communication and Discourse Strategies": {
    startDate: "2025-01-03",
    Tuesday: { period: 1, time: "12:00 PM - 1:00 PM" },
    Friday: { period: 2, time: "4:00 PM - 6:00 PM" },
    endDate: "2025-05-21",
  },
  Calculus: {
    startDate: "2025-01-03",
    Tuesday: { period: 1, time: "11:00 AM - 12:00 PM" },
    Wednesday: { period: 2, time: "2:00 PM - 4:00 PM" },
    endDate: "2025-05-21",
  },
  "Quantam Mechanics": {
    startDate: "2025-01-03",
    Tuesday: { period: 2, time: "4:00 PM - 6:00 PM" },
    Thursday: { period: 1, time: "11:00 AM - 12:00 PM" },
    endDate: "2025-05-21",
  },
  "Signal and System 1st Half": {
    startDate: "2025-01-03",
    Monday: { period: 2, time: "11:00 AM - 1:00 PM" },
    Wednesday: { period: 1, time: "9:00 AM - 10:00 AM" },
    Thursday: { period: 1, time: "2:00 PM - 4:00 PM" },
    Friday: { period: 1, time: "11:00 AM - 12:00 PM" },
    endDate: "2025-02-27",
  },
  "Optimization Techniques 1st Half": {
    startDate: "2025-01-03",
    Wednesday: { period: 1, time: "11:00 AM - 12:00 PM" },
    Friday: { period: 2, time: "2:00 PM - 4:00 PM" },
    endDate: "2025-02-27",
  },
  "Object Oriented Programming 2nd Half": {
    startDate: "2025-02-28",
    Monday: { period: 2, time: "11:00 AM - 1:00 PM" },
    Wednesday: { period: 1, time: "9:00 AM - 10:00 AM" },
    Thursday: { period: 2, time: "2:00 PM - 4:00 PM" },
    Friday: { period: 1, time: "11:00 AM - 12:00 PM" },
    endDate: "2025-05-21",
  },
  "Introduction to IoT(CSE)": {
    startDate: "2025-01-03",
    Monday: { period: 2, time: "11:00 AM - 1:00 PM" },
    Wednesday: { period: 1, time: "9:00 AM - 10:00 AM" },
    endDate: "2025-05-21",
  },
  "Design &Prototyping(CSE)": {
    startDate: "2025-01-03",
    Tuesday: { period: 2, time: "4:00 PM - 6:00 PM" },
    Thursday: { period: 1, time: "12:00 PM - 1:00 PM" },
    endDate: "2025-05-21",
  },
  "3D Printing(CSE)": {
    startDate: "2025-01-02",
    Wednesday: { period: 2, time: "4:00 PM - 6:00 PM" },
    Friday: { period: 1, time: "12:00 PM - 1:00 PM" },
    endDate: "2025-05-21",
  },
  "Introduction to AI and ML(CSE)": {
    startDate: "2025-01-03",
    Thursday: { period: 2, time: "2:00 PM - 4:00 PM" },
    Friday: { period: 1, time: "11:00 AM - 12:00 PM" },
    endDate: "2025-05-21",
  },
  "Communication and Discourse Strategies(CSE)": {
    startDate: "2025-01-02",
    Monday: { period: 1, time: "10:00 AM - 11:00 AM" },
    Friday: { period: 2, time: "9:00 AM - 10:00 AM" },
    endDate: "2025-05-21",
  },
  "Calculus(CSE)": {
    startDate: "2025-01-03",
    Wednesday: { period: 1, time: "10:00 AM - 11:00 AM" },
    Thursday: { period: 2, time: "9:00 AM - 11:00 AM" },
    endDate: "2025-05-21",
  },
  "Quantam Mechanics(CSE)": {
    startDate: "2025-01-02",
    Friday: { period: 2, time: "4:00 PM - 6:00 PM" },
    Wednesday: { period: 1, time: "12:00 PM - 1:00 PM" },
    endDate: "2025-05-21",
  },
  "Signal and System(CSE) 1st Half": {
    startDate: "2025-01-02",
    Tuesday: { period: 2, time: "11:00 AM - 1:00 PM" },
    Wednesday: { period: 1, time: "11:00 AM - 12:00 PM" },
    Thursday: { period: 1, time: "5:00 PM - 6:00 PM" },
    Friday: { period: 2, time: "2:00 PM - 4:00 PM" },
    endDate: "2025-02-27",
  },
  "Optimization Techniques(CSE) 1st Half": {
    startDate: "2025-01-03",
    Monday: { period: 1, time: "3:00 PM - 4:00 PM" },
    Tuesday: { period: 2, time: "2:00 PM - 4:00 PM" },
    Wednesday: { period: 2, time: "2:00 PM - 4:00 PM" },
    Thursday: { period: 1, time: "11:00 AM - 12:00 PM" },
    endDate: "2025-02-27",
  },
  "Object Oriented Programming(CSE) 2nd Half": {
    startDate: "2025-02-28",
    Tuesday: { period: 2, time: "11:00 AM - 1:00 PM" },
    Wednesday: { period: 1, time: "11:00 AM - 12:00 PM" },
    Thursday: { period: 1, time: "5:00 PM - 6:00 PM" },
    Friday: { period: 2, time: "2:00 PM - 4:00 PM" },
    endDate: "2025-05-21",
  },
  "Introduction to IoT(ECE)": {
    startDate: "2025-01-03",
    Wednesday: { period: 1, time: "10:00 AM - 11:00 AM" },
    Thursday: { period: 2, time: "9:00 AM - 11:00 AM" },
    endDate: "2025-05-21",
  },
  "Design &Prototyping(ECE)": {
    startDate: "2025-01-02",
    Wednesday: { period: 2, time: "4:00 PM - 6:00 PM" },
    Friday: { period: 1, time: "12:00 PM - 1:00 PM" },
    endDate: "2025-05-21",
  },
  "3D Printing(ECE)": {
    startDate: "2025-01-02",
    Tuesday: { period: 1, time: "12:00 PM - 1:00 PM" },
    Friday: { period: 2, time: "4:00 PM - 6:00 PM" },
    endDate: "2025-05-21",
  },
  "Introduction to AI and ML(ECE)": {
    startDate: "2025-01-03",
    Tuesday: { period: 2, time: "4:00 PM - 6:00 PM" },
    Thursday: { period: 1, time: "12:00 PM - 1:00 PM" },
    endDate: "2025-05-21",
  },
  "Communication and Discourse Strategies(ECE)": {
    startDate: "2025-01-02",
    Monday: { period: 2, time: "2:00 PM - 4:00 PM" },
    Friday: { period: 1, time: "11:00 AM - 12:00 PM" },
    endDate: "2025-05-21",
  },
  "Calculus(ECE)": {
    startDate: "2025-01-02",
    Friday: { period: 2, time: "4:00 PM - 6:00 PM" },
    Wednesday: { period: 1, time: "11:00 AM - 12:00 PM" },
    endDate: "2025-05-21",
  },
  "Quantam Mechanics(ECE)": {
    startDate: "2025-01-03",
    Monday: { period: 1, time: "10:00 AM - 11:00 AM" },
    Friday: { period: 2, time: "9:00 AM - 11:00 AM" },
    endDate: "2025-05-21",
  },
  "Signal and System(ECE) 1st Half": {
    startDate: "2025-01-03",
    Tuesday: { period: 3, time: "10:00 AM - 11:00 AM \n 2:00 PM - 4:00 PM" },
    Wednesday: { period: 2, time: "4:00 PM - 6:00 PM" },
    Thursday: { period: 1, time: "11:00 AM - 12:00 PM" },
    endDate: "2025-02-27",
  },
  "Optimization Techniques(ECE) 1st Half": {
    startDate: "2025-01-03",
    Monday: { period: 2, time: "10:00 AM - 12:00 PM" },
    Tuesday: { period: 1, time: "11:00 AM - 12:00 PM" },
    Wednesday: { period: 1, time: "9:00 AM - 10:00 AM" },
    Thursday: { period: 2, time: "2:00 PM - 4:00 PM" },
    endDate: "2025-02-27",
  },
  "Object Oriented Programming(ECE) 2nd Half": {
    startDate: "2025-02-28",
    Tuesday: { period: 3, time: "10:00 AM - 11:00 AM \n 2:00 PM - 4:00 PM" },
    Wednesday: { period: 2, time: "4:00 PM - 6:00 PM" },
    Thursday: { period: 1, time: "11:00 AM - 12:00 PM" },
    endDate: "2025-05-21",
  },

  // Add other courses here as needed
};

export default courseSchedules;
