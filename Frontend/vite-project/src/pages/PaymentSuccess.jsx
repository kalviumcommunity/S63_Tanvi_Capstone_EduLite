import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const session_id = queryParams.get('session_id');
        const amount = queryParams.get('amount');

        if (!session_id || !amount) {
          setStatus('error');
          setError('Invalid payment session data');
          return;
        }

        await axiosInstance.post('/confirm-payment', { session_id, amount });
        setStatus('success');
      } catch (err) {
        console.error('Confirmation failed', err);
        setStatus('error');
        setError(err.response?.data?.error || 'Failed to confirm payment with the server.');
      }
    };

    confirmPayment();
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        {status === 'processing' && (
          <div className="flex flex-col items-center">
            <FaSpinner className="text-5xl text-indigo-600 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-gray-800">Verifying Payment...</h2>
            <p className="text-gray-500 mt-2">Please do not close or refresh this page.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
              <FaCheckCircle className="text-6xl text-green-500 mb-6" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
            <p className="text-gray-500 mt-2">Your fee has been updated and you earned 50 points.</p>
            <button 
              onClick={() => navigate('/fees')}
              className="mt-8 w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <FaTimesCircle className="text-6xl text-red-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800">Payment Verification Failed</h2>
            <p className="text-red-500 mt-2">{error}</p>
            <button 
              onClick={() => navigate('/fees')}
              className="mt-8 w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
