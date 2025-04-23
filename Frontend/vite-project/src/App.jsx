import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../src/pages/LandingPages"; // Adjust the path as per your folder structure
import Login from "./pages/studentlogin"; 
import Signup from "../src/pages/signup";
import Dashboard from "../src/pages/StudentDashboard"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
