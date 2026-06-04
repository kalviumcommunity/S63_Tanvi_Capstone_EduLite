import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueNumber, setQueueNumber] = useState(Math.floor(Math.random() * 50) + 10);
  const [reconnectTimer, setReconnectTimer] = useState(5);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (!isOnline) {
      interval = setInterval(() => {
        setReconnectTimer((prev) => {
          if (prev <= 1) {
            // Simulate queue moving when timer resets
            setQueueNumber((q) => Math.max(1, q - Math.floor(Math.random() * 3) - 1));
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOnline]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-zinc-900 text-white p-3 shadow-2xl flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="flex items-center text-red-400 font-semibold gap-2">
            <FaExclamationTriangle className="animate-pulse" />
            <span>Connection Lost</span>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-zinc-700"></div>
          
          <div className="flex items-center text-sm text-zinc-300 gap-2">
            <div className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-100 rounded-full animate-spin"></div>
            <span>Reconnecting in {reconnectTimer}s...</span>
          </div>

          <div className="hidden sm:block w-px h-5 bg-zinc-700"></div>

          <div className="bg-zinc-800 px-3 py-1 rounded-full text-xs font-mono text-zinc-400 border border-zinc-700">
            Queue Position: <span className="text-white font-bold">{queueNumber}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
