import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const GamificationWidget = ({ student }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axiosInstance.get('/leaderboard');
        setLeaderboard(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-6 border-t-4 border-yellow-400">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FaTrophy className="text-yellow-500 mr-2" />
          My Rewards
        </h2>
        <span className="bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded-full text-sm">
          {student?.points || 0} Points
        </span>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Top Students Leaderboard</h3>
        <div className="space-y-3">
          {leaderboard.map((user, idx) => (
            <motion.div 
              key={user._id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-xl ${user._id === student?._id ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}
            >
              <div className="flex items-center">
                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold mr-3 ${idx === 0 ? 'bg-yellow-400 text-white' : idx === 1 ? 'bg-gray-300 text-gray-800' : idx === 2 ? 'bg-orange-300 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {idx + 1}
                </span>
                <span className="font-medium text-gray-800 text-sm">{user.name}</span>
              </div>
              <span className="text-xs font-bold text-gray-500">{user.points || 0} pts</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationWidget;
