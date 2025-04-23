import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axiosInstance from "../axiosInstance";

const Dashboard = () => {
  const [studentData, setStudentData] = useState(null); // State to hold student data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch student data from the backend
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axiosInstance.get("/dashboard"); // Adjusted to use the baseURL from axiosInstance
        setStudentData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Conditional rendering based on loading, error, or data state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl font-semibold">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <span className="font-semibold">Error: {error}</span>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <span className="font-semibold">No data available</span>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Content */}
      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {studentData.name}! 🎓
        </h1>
        <p className="text-lg mb-6">
          You've completed {studentData.completedCourses} out of{" "}
          {studentData.totalCourses} courses!
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Courses Enrolled */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold flex items-center">
              <span className="mr-2">📚</span> Courses Enrolled
            </h2>
            <p className="text-2xl font-bold">{studentData.totalCourses}</p>
          </div>

          {/* Fee Status */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold flex items-center">
              <span className="mr-2">💰</span> Fee Status
            </h2>
            <p className="text-2xl font-bold">
              ₹{studentData.feePaid} / ₹{studentData.feeTotal}
            </p>
          </div>

          {/* Next Fee Due */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold flex items-center">
              <span className="mr-2">📅</span> Next Fee Due
            </h2>
            <p className="text-2xl font-bold">{studentData.nextFeeDue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
