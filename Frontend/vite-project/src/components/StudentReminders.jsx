import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { FaClock, FaExclamationCircle, FaCheckCircle, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const StudentReminders = ({ student }) => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    if (!student?._id) return;
    const fetchReminders = async () => {
      try {
        const res = await axiosInstance.get(`/reminders/student/${student._id}`);
        setReminders(res.data);
      } catch (err) {
        console.error("Failed to fetch reminders", err);
      }
    };
    fetchReminders();
  }, [student?._id]);

  return (
    <div className="bg-white rounded-2xl shadow p-6 border-t-4 border-indigo-500 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FaClock className="text-indigo-500 mr-2" />
          Smart Reminders
        </h2>
        <span className="bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full text-xs">
          {reminders.filter(r => r.status === 'PENDING').length} Pending
        </span>
      </div>

      <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {reminders.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-4">No upcoming reminders.</p>
          ) : (
            reminders.map((reminder, idx) => (
              <motion.div
                key={reminder._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-xl border ${reminder.status === 'PENDING' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {reminder.status === 'PENDING' ? <FaExclamationCircle className="text-red-500 mr-3 mt-1" /> : <FaCheckCircle className="text-green-500 mr-3 mt-1" />}
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{reminder.message}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        Due: {new Date(reminder.dueDate).toLocaleDateString()}
                        {reminder.channels?.includes("EMAIL") && <FaEnvelope className="text-gray-400" />}
                        {reminder.channels?.includes("WHATSAPP") && <FaWhatsapp className="text-green-500" />}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${reminder.status === 'PENDING' ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'}`}>
                    {reminder.status}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentReminders;
