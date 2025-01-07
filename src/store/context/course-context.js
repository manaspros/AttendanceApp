import React, { createContext, useContext, useState } from "react";

// Create the Course Context
const CourseContext = createContext();

// Create a Provider Component
export const CourseProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const coursesByCategory = {
    CSE: [
      "Introduction to IoT(CSE)",
      "Design &Prototyping(CSE)",
      "3D Printing(CSE)",
      "Introduction to AI and ML(CSE)",
      "Communication and Discourse Strategies(CSE)",
      "Calculus(CSE)",
      "Quantam Mechanics(CSE)",
      "Signal and System(CSE) 1st Half",
      "Optimization Techniques(CSE) 1st Half",
      "Object Oriented Programming(CSE) 2nd Half",
    ],
    DSAI: [
      "Introduction to IoT",
      "Design &Prototyping",
      "3D Printing",
      "Introduction to AI and ML",
      "Communication and Discourse Strategies",
      "Calculus",
      "Quantam Mechanics",
      "Signal and System 1st Half",
      "Optimization Techniques 1st Half",
      "Object Oriented Programming 2nd Half",
    ],
    ECE: [
      "Introduction to IoT(ECE)",
      "Design &Prototyping(ECE)",
      "3D Printing(ECE)",
      "Introduction to AI and ML(ECE)",
      "Communication and Discourse Strategies(ECE)",
      "Calculus(ECE)",
      "Quantam Mechanics(ECE)",
      "Signal and System(ECE) 1st Half",
      "Optimization Techniques(ECE) 1st Half",
      "Object Oriented Programming(ECE) 2nd Half",
    ],
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setSelectedCourses(coursesByCategory[category]);
  };

  return (
    <CourseContext.Provider
      value={{ selectedCategory, selectedCourses, selectCategory }}
    >
      {children}
    </CourseContext.Provider>
  );
};

// Create a Custom Hook to Use the Context
export const useCourseContext = () => {
  return useContext(CourseContext);
};
