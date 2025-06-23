import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import axiosInstance from "../axiosInstance";
import { useLocation } from 'react-router-dom';

const RecordFeePayment = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const location = useLocation();
  const { state } = location;

  const [form, setForm] = useState({
    student: state?.studentId || '',
    course: '',
    totalFee: '',
    amountPaid: '',
    paymentDate: '',
    paymentMode: ''
  });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axiosInstance.get("/admin/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setStudents(res.data.filter(u => u.role !== 'admin'));
      } catch (error) {
        console.error('Error fetching students:', error);
        setFormError('Failed to fetch students. Please try again.');
      }
    };
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/admin/courses", {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setCourses(res.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setFormError('Failed to fetch courses. Please try again.');
      }
    };
    fetchStudents();
    fetchCourses();
  }, []);

  // If we have a pre-selected student, find their course
  useEffect(() => {
    if (state?.studentId && students.length > 0) {
      const selectedStudent = students.find(s => s._id === state.studentId);
      if (selectedStudent && selectedStudent.enrolledCourses && selectedStudent.enrolledCourses.length > 0) {
        setForm(prev => ({
          ...prev,
          course: selectedStudent.enrolledCourses[0]._id
        }));
      }
    }
  }, [state?.studentId, students]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post("/admin/fees", {
        studentId: form.student,
        courseId: form.course,
        totalFee: form.totalFee,
        amountPaid: form.amountPaid,
        paymentDate: form.paymentDate,
        paymentMode: form.paymentMode
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });

      if (response.data.message) {
        alert('Payment recorded successfully!');
        // Reset form
        setForm({
          student: '',
          course: '',
          totalFee: '',
          amountPaid: '',
          paymentDate: '',
          paymentMode: ''
        });
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      setFormError(error.response?.data?.error || 'Failed to record payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow p-10 mt-10">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Record New Fee Payment</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Select Student</label>
              <select
                name="student"
                value={form.student}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>Select a student</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Select Course</label>
              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>Select a course</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Total Fee</label>
              <input
                type="number"
                name="totalFee"
                value={form.totalFee}
                onChange={handleChange}
                required
                placeholder="₹ Total fee amount"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Amount Paid</label>
              <input
                type="number"
                name="amountPaid"
                value={form.amountPaid}
                onChange={handleChange}
                required
                placeholder="₹ Enter amount paid"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Payment Date</label>
              <input
                type="date"
                name="paymentDate"
                value={form.paymentDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Payment Mode</label>
              <select
                name="paymentMode"
                value={form.paymentMode}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>Select payment mode</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            {formError && <div className="text-red-600 bg-red-100 rounded-lg p-3">{formError}</div>}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 font-semibold disabled:opacity-60"
              >
                {loading ? 'Recording...' : 'Record Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RecordFeePayment; 