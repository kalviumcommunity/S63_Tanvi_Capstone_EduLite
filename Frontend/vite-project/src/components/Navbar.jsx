import React from "react";
import { FaUserGraduate, FaBook, FaDollarSign, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen bg-indigo-700 text-white flex flex-col justify-between fixed">
      {<div className="mr-3">
  {/* <img src="/logo.png" alt="EduLite Logo" className="w-10 h-10 rounded-full" /> */}
</div>
}
      <div className="p-6 flex items-center">
        {/* Add your logo image or icon here */}
        <div className="bg-white w-10 h-10 flex items-center justify-center rounded-full mr-3">
          <span className="text-indigo-700 font-bold text-xl">Ed</span>
        </div>
        <h2 className="text-2xl font-bold">EduLite</h2>
      </div>

      {/* Menu Items */}
      <ul className="flex-1">
        <li
          className="flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-800"
          onClick={() => navigate("/dashboard")}
        >
          <span className="mr-4">🏠</span>
          <span>Dashboard</span>
        </li>
        <li
          className="flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-800"
          onClick={() => navigate("/profile")}
        >
          <FaUserGraduate className="mr-4" />
          <span>Profile</span>
        </li>
        <li
          className="flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-800"
          onClick={() => navigate("/courses")}
        >
          <FaBook className="mr-4" />
          <span>Courses</span>
        </li>
        <li
          className="flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-800"
          onClick={() => navigate("/fees")}
        >
          <FaDollarSign className="mr-4" />
          <span>Fees</span>
        </li>
      </ul>

      {/* Logout */}
      <div
        className="flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-800 border-t border-indigo-600"
        onClick={() => navigate("/logout")}
      >
        <FaSignOutAlt className="mr-4" />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Navbar;
