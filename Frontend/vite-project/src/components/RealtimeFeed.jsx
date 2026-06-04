import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axiosInstance from '../axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBolt, FaExclamationCircle, FaUserPlus, FaMoneyBillWave } from 'react-icons/fa';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

const RealtimeFeed = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Initial fetch of recent logs
    const fetchLogs = async () => {
      try {
        const res = await axiosInstance.get('/activity-logs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch activity logs", err);
      }
    };
    fetchLogs();

    // Setup Socket.IO connection
    const socket = io(SOCKET_URL, {
      withCredentials: true
    });

    socket.on('newActivity', (activity) => {
      // Add new activity at the top
      setLogs(prev => [activity, ...prev].slice(0, 50));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getIcon = (action) => {
    if (action?.includes('STUDENT')) return <FaUserPlus className="text-blue-500" />;
    if (action?.includes('FEE') || action?.includes('PAYMENT')) return <FaMoneyBillWave className="text-green-500" />;
    if (action?.includes('ERROR')) return <FaExclamationCircle className="text-red-500" />;
    return <FaBolt className="text-yellow-500" />;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="relative flex h-3 w-3 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Live Activity Feed
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        <AnimatePresence>
          {logs.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-10">No recent activity</p>
          ) : (
            logs.map((log, index) => (
              <motion.div
                key={log._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500"
              >
                <div className="mt-1 mr-3">
                  {getIcon(log.action)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{log.message}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RealtimeFeed;
