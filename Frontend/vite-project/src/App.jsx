import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../src/pages/LandingPages"; // Adjust the path as per your folder structure
import Login from "./pages/studentlogin"; 
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "../src/pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import StudentCourses from "./pages/StudentCourses";
import StudentFees from "./pages/StudentFees";
import StudentLayout from "./components/StudentLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminCourses from "./pages/AdminCourses";
import AdminFees from "./pages/AdminFees";
import AddStudent from "./pages/AddStudent";
import RecordFeePayment from "./pages/RecordFeePayment";
import AddNotice from "./pages/AddNotice";
import GenerateReport from "./pages/GenerateReport";
import AuthSuccess from "./pages/AuthSuccess";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        {/* Student Routes with StudentLayout */}
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/courses" element={<StudentCourses />} />
          <Route path="/fees" element={<StudentFees />} />
        </Route>
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/fees" element={<AdminFees />} />
        <Route path="/admin/students/add" element={<AddStudent />} />
        <Route path="/admin/record-fee-payment" element={<RecordFeePayment />} />
        <Route path="/admin/add-notice" element={<AddNotice />} />
        <Route path="/admin/generate-report" element={<GenerateReport />} />
      </Routes>
    </Router>
  );
};

export default App;
