import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaLock, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const MockPaymentModal = ({ isOpen, onClose, amount, itemName }) => {
  const [step, setStep] = useState(1); // 1: Input, 2: Processing, 3: Success
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const handlePay = (e) => {
    e.preventDefault();
    setStep(2);
    // Simulate processing delay
    setTimeout(() => {
      setStep(3);
    }, 2500);
  };

  const handleReset = () => {
    setStep(1);
    setCardData({ number: '', expiry: '', cvc: '', name: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          {/* Close button */}
          {step !== 2 && (
            <button
              onClick={handleReset}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <FaTimes size={20} />
            </button>
          )}

          {step === 1 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-full mb-4">
                  <FaLock className="text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Secure Payment</h2>
                <p className="text-gray-500 mt-1">Complete your payment for {itemName}</p>
                <div className="mt-4 text-3xl font-bold text-indigo-600">₹{amount?.toLocaleString() || '0'}</div>
              </div>

              <form onSubmit={handlePay} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={cardData.name}
                    onChange={e => setCardData({...cardData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={cardData.number}
                    onChange={e => setCardData({...cardData, number: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      required
                      placeholder="12/25"
                      maxLength={5}
                      value={cardData.expiry}
                      onChange={e => setCardData({...cardData, expiry: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">CVC</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      maxLength={4}
                      value={cardData.cvc}
                      onChange={e => setCardData({...cardData, cvc: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 mt-6 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  <FaLock size={12} />
                  Pay ₹{amount?.toLocaleString() || '0'}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <FaSpinner className="text-4xl text-indigo-600 animate-spin mb-6" />
              <h3 className="text-xl font-bold text-gray-800">Processing Payment</h3>
              <p className="text-gray-500 mt-2">Please do not close this window...</p>
            </div>
          )}

          {step === 3 && (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <FaCheckCircle className="text-6xl text-green-500 mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800">Payment Successful!</h3>
              <p className="text-gray-500 mt-2 mb-8">Your receipt has been sent to your email.</p>
              
              <button
                onClick={handleReset}
                className="w-full py-3 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-100 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MockPaymentModal;
