import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { FaSpinner } from "react-icons/fa";

const statusStyles = {
  Paid: "bg-green-100 text-green-700",
  Partial: "bg-purple-100 text-purple-700",
  Unpaid: "bg-red-100 text-red-700",
};

const StudentFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [customAmounts, setCustomAmounts] = useState({});

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await axiosInstance.get("/fees/me");
        setFees(res.data);
        
        // Initialize custom amounts with the full remaining balance by default
        const initialAmounts = {};
        res.data.forEach(fee => {
          initialAmounts[fee._id] = fee.dueAmount - (fee.paidAmount || 0);
        });
        setCustomAmounts(initialAmounts);
      } catch {
        setError("Failed to load fee records");
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  const handleAmountChange = (feeId, value) => {
    setCustomAmounts(prev => ({
      ...prev,
      [feeId]: value
    }));
  };

  const handlePayClick = async (fee) => {
    try {
      setPaymentProcessing(true);
      const amountToPay = customAmounts[fee._id];
      const maxBalance = fee.dueAmount - (fee.paidAmount || 0);
      
      if (!amountToPay || amountToPay <= 0 || amountToPay > maxBalance) {
        alert(`Please enter a valid amount between ₹1 and ₹${maxBalance}`);
        setPaymentProcessing(false);
        return;
      }

      const res = await axiosInstance.post('/create-checkout-session', {
        amount: amountToPay,
        itemName: fee.course + ' Fee',
        courseId: fee._id
      });
      
      if (res.data.url) {
        window.location.href = res.data.url; // Redirect to Stripe
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert(err.response?.data?.error || "Failed to initialize payment. Ensure Stripe keys are configured in backend .env");
      setPaymentProcessing(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2 text-zinc-900">Fee Status</h1>
      <p className="text-gray-500 mb-8">View your payment history and pay your dues securely via Stripe</p>
      
      {paymentProcessing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
            <p className="text-lg font-semibold text-gray-800">Redirecting to Secure Checkout...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 max-w-4xl">
        {fees.map((fee) => {
          const balance = fee.dueAmount - (fee.paidAmount || 0);
          return (
          <div key={fee._id} className="bg-white rounded-2xl shadow p-8 flex flex-col gap-2 relative border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xl font-semibold text-zinc-900">{fee.course}</div>
              <span className={`px-4 py-1 rounded-full text-sm font-semibold ${statusStyles[fee.status]}`}>{fee.status}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <div className="text-gray-500 text-sm">Total Fee</div>
                <div className="font-semibold text-lg text-gray-800">₹{fee.dueAmount}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Due Date</div>
                <div className="font-semibold text-lg text-gray-800">{fee.dueDate || 'N/A'}</div>
              </div>
              {fee.status !== "Unpaid" && (
                <>
                  <div>
                    <div className="text-gray-500 text-sm">Paid Amount</div>
                    <div className="font-semibold text-lg text-green-600">₹{fee.paidAmount}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Paid On</div>
                    <div className="font-semibold text-lg text-gray-800">{fee.paidDate || 'N/A'}</div>
                  </div>
                </>
              )}
            </div>

            {fee.status !== 'Paid' && balance > 0 && (
              <div className="mt-6 flex flex-col md:flex-row justify-between items-center border-t pt-4 gap-4">
                <div className="w-full md:w-auto">
                  <div className="text-sm text-gray-500">Remaining Balance</div>
                  <div className="text-2xl font-bold text-red-600">₹{balance}</div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input 
                      type="number" 
                      min="1"
                      max={balance}
                      value={customAmounts[fee._id] || ''}
                      onChange={(e) => handleAmountChange(fee._id, Number(e.target.value))}
                      className="w-32 pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-gray-700"
                      placeholder="Amount"
                    />
                  </div>
                  <button
                    onClick={() => handlePayClick(fee)}
                    disabled={paymentProcessing}
                    className="px-6 py-2 whitespace-nowrap bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    Pay Custom
                  </button>
                </div>
              </div>
            )}
          </div>
        )})}
      </div>
    </div>
  );
};

export default StudentFees; 