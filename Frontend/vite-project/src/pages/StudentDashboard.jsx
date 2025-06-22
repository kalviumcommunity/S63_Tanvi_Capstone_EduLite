import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
// import Navbar from "../components/Navbar";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log('StudentDashboard: Starting to fetch data');
      try {
        const [studentRes, notificationsRes] = await Promise.all([
          axiosInstance.get("/users/full-me"),
          axiosInstance.get("/notifications")
        ]);
        console.log('StudentDashboard: Data fetched successfully');
        console.log('StudentDashboard: Student data:', studentRes.data);
        console.log('StudentDashboard: Notifications data:', notificationsRes.data);
        setStudent(studentRes.data);
        setNotifications(notificationsRes.data);
      } catch (err) {
        console.error('StudentDashboard: Error fetching data:', err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNotice(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!student) return <pre className="bg-gray-100 p-4 rounded">No student data.<br/>Raw: {JSON.stringify(student, null, 2)}</pre>;

  // Use only real data, show 'N/A' if missing
  const paid = student.feePaid !== undefined ? student.feePaid : 'N/A';
  const total = student.feeTotal !== undefined ? student.feeTotal : 'N/A';
  const progress = (typeof paid === 'number' && typeof total === 'number' && total > 0)
    ? Math.min(100, Math.round((paid / total) * 100))
    : 0;
  const nextFeeDue = student.nextFeeDue ? new Date(student.nextFeeDue).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  const totalCourses = student.totalCourses !== undefined ? student.totalCourses : (student.enrolledCourses ? student.enrolledCourses.length : 'N/A');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-8 w-full">
      <h1 className="text-4xl font-bold mb-2 text-zinc-900">Welcome, {student.name}!
        <span className="ml-2" role="img" aria-label="graduation">🎓</span>
      </h1>
      <p className="text-gray-500 mb-8">
        Hey, Nice to see you again!
      </p>
      
      {/* Main Content Area - Flex Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Stats Cards - Left Side */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Courses Enrolled */}
            <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center">
              <div className="bg-indigo-50 p-4 rounded-full mb-4">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#6366F1" d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/><path fill="#6366F1" d="M23 19a1 1 0 01-1 1H2a1 1 0 01-1-1v-2.18a1 1 0 01.55-.89l9-4.09a1 1 0 01.9 0l9 4.09a1 1 0 01.55.89V19z" opacity=".2"/></svg>
              </div>
              <div className="text-lg text-gray-500 mb-1">Courses Enrolled</div>
              <div className="text-3xl font-bold text-zinc-900">{totalCourses}</div>
            </div>
            {/* Fee Status */}
            <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center">
              <div className="bg-indigo-50 p-4 rounded-full mb-4">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#6366F1" d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z"/><path fill="#6366F1" d="M12 17a5 5 0 100-10 5 5 0 000 10z" opacity=".2"/></svg>
              </div>
              <div className="text-lg text-gray-500 mb-1">Fee Status</div>
              <div className="text-2xl font-bold text-zinc-900 mb-2">₹{paid} <span className="text-gray-400 text-lg">/ ₹{total}</span></div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            {/* Next Fee Due */}
            <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center">
              <div className="bg-indigo-50 p-4 rounded-full mb-4">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#6366F1" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z"/></svg>
              </div>
              <div className="text-lg text-gray-500 mb-1">Next Fee Due</div>
              <div className="text-2xl font-bold text-zinc-900">{nextFeeDue}</div>
            </div>
          </div>
        </div>

        {/* Notices Section - Right Side */}
        <div className="lg:w-80">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Notices & Updates
              </h2>
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {notifications.length} {notifications.length === 1 ? 'Notice' : 'Notices'}
              </span>
            </div>
            
            {notifications.length === 0 ? (
              <div className="text-center py-6">
                <svg className="w-8 h-8 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-sm">No notices at the moment</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.map((notice) => (
                  <div 
                    key={notice._id} 
                    className="border-l-3 border-gray-200 bg-gray-50 p-4 rounded-r-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleNoticeClick(notice)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1 text-sm">{notice.title}</h3>
                        <p className="text-gray-600 text-xs mb-2 leading-relaxed line-clamp-2">{notice.description}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(notice.createdAt)}
                        </p>
                      </div>
                      <div className="ml-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                          New
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notice Modal */}
      {showModal && selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedNotice.title}</h2>
                  <p className="text-sm text-gray-500">Posted on {formatDate(selectedNotice.createdAt)}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedNotice.description}
                </p>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
