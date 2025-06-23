import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { FaUserPlus, FaBook, FaDollarSign, FaFileAlt } from 'react-icons/fa';
import axiosInstance from "../axiosInstance";
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, change }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <div className="flex items-center justify-between mt-2">
      <div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <span className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors w-full"
  >
    {Icon && <Icon className="text-indigo-600 text-xl mr-3" />}
    <span className="text-gray-700">{title}</span>
  </button>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    revenue: 0,
    dueFees: 0,
    newEnrollments: 0,
    completionRate: 0,
    studentGrowth: 0,
    courseGrowth: 0,
    revenueGrowth: 0,
    feeChange: 0,
    enrollmentGrowth: 0,
    completionGrowth: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setStats(response.data.stats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/admin/notifications", {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setNotifications(res.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchDashboardData();
    fetchNotifications();
  }, []);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'addStudent':
        navigate('/admin/students/add');
        break;
      case 'newCourse':
        navigate('/admin/courses');
        break;
      case 'recordPayment':
        navigate('/admin/record-fee-payment');
        break;
      case 'generateReport':
        navigate('/admin/generate-report');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-xl text-gray-600">Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">WELCOME, ADMIN</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Students"
            value={stats.totalStudents.toLocaleString()}
            change={stats.studentGrowth}
          />
          <StatCard
            title="Active Courses"
            value={stats.activeCourses}
            change={stats.courseGrowth}
          />
          <StatCard
            title="Revenue"
            value={`₹${(stats.revenue / 1000).toFixed(1)}k`}
            change={stats.revenueGrowth}
          />
          <StatCard
            title="Due Fees"
            value={`₹${(stats.dueFees / 1000).toFixed(1)}k`}
            change={stats.feeChange}
          />
          <StatCard
            title="New Enrollments"
            value={stats.newEnrollments}
            change={stats.enrollmentGrowth}
          />
          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            change={stats.completionGrowth}
          />
        </div>

        {/* Quick Actions and Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickAction
                icon={FaUserPlus}
                title="Add Student"
                onClick={() => handleQuickAction('addStudent')}
              />
              <QuickAction
                icon={FaBook}
                title="New Course"
                onClick={() => handleQuickAction('newCourse')}
              />
              <QuickAction
                icon={FaDollarSign}
                title="Record Payment"
                onClick={() => handleQuickAction('recordPayment')}
              />
              <QuickAction
                icon={FaFileAlt}
                title="Generate Report"
                onClick={() => handleQuickAction('generateReport')}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                onClick={() => navigate('/admin/add-notice')}
              >
                Add Notice
              </button>
            </div>
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div key={notification._id || index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800">{notification.title}</p>
                  <p className="text-gray-700 mb-1">{notification.description}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 