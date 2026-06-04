import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import axiosInstance from '../axiosInstance';
import { FaBell, FaPlus, FaEnvelope, FaWhatsapp, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminReminders = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [type, setType] = useState('FEE');
  const [message, setMessage] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [channels, setChannels] = useState(['EMAIL']);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // We could fetch all reminders, but right now the API is per student. 
  // We can just build the creation form for now, and a mock list or rely on student search.

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axiosInstance.get('/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        const studentList = res.data.filter(u => u.role === 'student');
        setStudents(studentList);
      } catch (err) {
        console.error('Failed to fetch students', err);
      }
    };
    fetchStudents();
  }, []);

  const handleChannelToggle = (channel) => {
    setChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !message || !dueDate || channels.length === 0) {
      setErrorMsg('Please fill all required fields and select at least one channel.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await axiosInstance.post('/reminders', {
        studentId: selectedStudent,
        type,
        message,
        dueDate,
        channels
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setSuccessMsg('Reminder successfully scheduled!');
      setMessage('');
      setDueDate('');
      setChannels(['EMAIL']);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to create reminder.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaBell className="text-indigo-600" />
            Manage Reminders
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4">Create New Reminder</h2>
          
          <AnimatePresence>
            {successMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200">
                {successMsg}
              </motion.div>
            )}
            {errorMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  required
                >
                  <option value="">-- Choose a student --</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                  ))}
                </select>
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="FEE">Fee Payment</option>
                  <option value="DEADLINE">Important Deadline</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi [Name], your fee of ₹5000 is due tomorrow..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date / Trigger Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* Channels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Channels</label>
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => handleChannelToggle('EMAIL')}
                    className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${channels.includes('EMAIL') ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    <FaEnvelope className="mr-2" /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChannelToggle('WHATSAPP')}
                    className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${channels.includes('WHATSAPP') ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    <FaWhatsapp className="mr-2" /> WhatsApp
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Scheduling...' : (
                  <>
                    <FaPlus className="mr-2" /> Schedule Reminder
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminReminders;
