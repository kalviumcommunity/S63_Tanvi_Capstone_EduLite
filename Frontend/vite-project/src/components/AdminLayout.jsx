import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaBook, FaDollarSign, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdmin');
      navigate('/admin/login');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-indigo-700 text-white flex flex-col fixed shadow-lg">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-indigo-600">
          <img
            src="https://res.cloudinary.com/davztqz5k/image/upload/v1745123371/edulite_logo_figma_lcg648.png"
            alt="EduLite Logo"
            className="w-12 h-12 rounded-full bg-white object-contain shadow"
          />
          <h2 className="text-3xl font-bold tracking-wide">EduLite</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mt-2">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className={`flex items-center w-full px-6 py-4 text-left text-lg rounded-lg transition-all duration-150 group ${
                  isActive('/admin/dashboard') ? 'bg-indigo-800 shadow' : 'hover:bg-indigo-800 hover:shadow-lg'
                }`}
              >
                <FaTachometerAlt className="mr-4 group-hover:scale-110 transition-transform duration-150 text-2xl" />
                <span className="font-semibold">Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/students')}
                className={`flex items-center w-full px-6 py-4 text-left text-lg rounded-lg transition-all duration-150 group ${
                  isActive('/admin/students') ? 'bg-indigo-800 shadow' : 'hover:bg-indigo-800 hover:shadow-lg'
                }`}
              >
                <FaGraduationCap className="mr-4 group-hover:scale-110 transition-transform duration-150 text-2xl" />
                <span className="font-semibold">Students</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/courses')}
                className={`flex items-center w-full px-6 py-4 text-left text-lg rounded-lg transition-all duration-150 group ${
                  isActive('/admin/courses') ? 'bg-indigo-800 shadow' : 'hover:bg-indigo-800 hover:shadow-lg'
                }`}
              >
                <FaBook className="mr-4 group-hover:scale-110 transition-transform duration-150 text-2xl" />
                <span className="font-semibold">Courses</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/fees')}
                className={`flex items-center w-full px-6 py-4 text-left text-lg rounded-lg transition-all duration-150 group ${
                  isActive('/admin/fees') ? 'bg-indigo-800 shadow' : 'hover:bg-indigo-800 hover:shadow-lg'
                }`}
              >
                <FaDollarSign className="mr-4 group-hover:scale-110 transition-transform duration-150 text-2xl" />
                <span className="font-semibold">Fees</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center px-6 py-4 text-lg hover:bg-indigo-800 border-t border-indigo-600 transition-all duration-150 rounded-b-lg"
        >
          <FaSignOutAlt className="mr-4 text-2xl" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout; 