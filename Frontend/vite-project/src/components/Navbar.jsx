import React from "react";
import "./Navbar.css";

import { FaUserGraduate, FaBook, FaDollarSign, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-header">
        <h2 className="navbar-logo">EduLite</h2>
      </div>
      <ul className="navbar-menu">
        <li className="menu-item active">
          <span className="menu-icon">🏠</span>
          <span className="menu-text">Dashboard</span>
        </li>
        <li className="menu-item">
          <FaUserGraduate className="menu-icon" />
          <span className="menu-text">Students</span>
        </li>
        <li className="menu-item">
          <FaBook className="menu-icon" />
          <span className="menu-text">Courses</span>
        </li>
        <li className="menu-item">
          <FaDollarSign className="menu-icon" />
          <span className="menu-text">Fees</span>
        </li>
      </ul>
      <div className="logout">
        <FaSignOutAlt className="logout-icon" />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Navbar;
