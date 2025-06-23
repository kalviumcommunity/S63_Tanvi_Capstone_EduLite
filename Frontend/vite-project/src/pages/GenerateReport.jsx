import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import axiosInstance from "../axiosInstance";

const GenerateReport = () => {
  const [stats, setStats] = useState(null);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [outstandingFees, setOutstandingFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const dashboardRes = await axiosInstance.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setStats(dashboardRes.data.stats);

        const usersRes = await axiosInstance.get("/admin/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        const students = usersRes.data.filter(u => u.role === 'student');
        // Recent enrollments: last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        setRecentEnrollments(
          students.filter(s => new Date(s.createdAt) >= thirtyDaysAgo)
        );
        // Outstanding fees
        setOutstandingFees(
          students.filter(s => (s.feeTotal || 0) > (s.feePaid || 0))
        );
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch report data.');
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const downloadCSV = () => {
    let csv = 'Name,Email,Phone,Course,Fee Paid,Fee Total,Due\n';
    outstandingFees.forEach(s => {
      const course = s.enrolledCourses && s.enrolledCourses[0]?.name ? s.enrolledCourses[0].name : '';
      csv += `${s.name},${s.email},${s.phone || ''},${course},${s.feePaid || 0},${s.feeTotal || 0},${(s.feeTotal || 0)-(s.feePaid || 0)}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'outstanding_fees_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <AdminLayout><div className="p-10">Loading report...</div></AdminLayout>;
  if (error) return <AdminLayout><div className="p-10 text-red-600">{error}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow p-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Report</h1>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <div className="text-gray-500">Total Students</div>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </div>
          <div>
            <div className="text-gray-500">Total Courses</div>
            <div className="text-2xl font-bold">{stats.activeCourses}</div>
          </div>
          <div>
            <div className="text-gray-500">Total Revenue</div>
            <div className="text-2xl font-bold">₹{stats.revenue}</div>
          </div>
          <div>
            <div className="text-gray-500">Total Due Fees</div>
            <div className="text-2xl font-bold">₹{stats.dueFees}</div>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">Recent Enrollments (Last 30 Days)</h2>
        <div className="mb-8">
          {recentEnrollments.length === 0 ? <div className="text-gray-500">No recent enrollments.</div> : (
            <ul className="list-disc ml-6">
              {recentEnrollments.map(s => (
                <li key={s._id}>{s.name} ({s.email})</li>
              ))}
            </ul>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-2">Outstanding Fees</h2>
        <div className="mb-4">
          {outstandingFees.length === 0 ? <div className="text-gray-500">No outstanding fees.</div> : (
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Course</th>
                  <th className="p-2">Fee Paid</th>
                  <th className="p-2">Fee Total</th>
                  <th className="p-2">Due</th>
                </tr>
              </thead>
              <tbody>
                {outstandingFees.map(s => (
                  <tr key={s._id}>
                    <td className="p-2">{s.name}</td>
                    <td className="p-2">{s.email}</td>
                    <td className="p-2">{s.enrolledCourses && s.enrolledCourses[0]?.name}</td>
                    <td className="p-2">₹{s.feePaid || 0}</td>
                    <td className="p-2">₹{s.feeTotal || 0}</td>
                    <td className="p-2 text-red-600 font-bold">₹{(s.feeTotal || 0)-(s.feePaid || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <button
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
          onClick={downloadCSV}
        >
          Download as CSV
        </button>
      </div>
    </AdminLayout>
  );
};

export default GenerateReport; 