import React, { createContext, useContext, useState } from "react";

// Create the Course Context
const CourseContext = createContext();

// Create a Provider Component
export const CourseProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const coursesByCategory = {
    "Degree 1": ["Course 1A", "Course 1B", "Course 1C"],
    "Degree 2": ["Course 2A", "Course 2B", "Course 2C"],
    "Degree 3": ["Course 3A", "Course 3B", "Course 3C"],
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
