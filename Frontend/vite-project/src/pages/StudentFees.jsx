import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

const statusStyles = {
  Paid: "bg-green-100 text-green-700",
  Partial: "bg-purple-100 text-purple-700",
  Unpaid: "bg-red-100 text-red-700",
};

const StudentFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await axiosInstance.get("/fees/me");
        setFees(res.data);
      } catch {
        setError("Failed to load fee records");
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2 text-zinc-900">Fee Status</h1>
      <p className="text-gray-500 mb-8">View your payment history and upcoming dues</p>
      <div className="flex flex-col gap-6 max-w-4xl">
        {fees.map((fee) => (
          <div key={fee._id} className="bg-white rounded-2xl shadow p-8 flex flex-col gap-2 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xl font-semibold text-zinc-900">{fee.course}</div>
              <span className={`px-4 py-1 rounded-full text-sm font-semibold ${statusStyles[fee.status]}`}>{fee.status}</span>
            </div>
            <div className="text-gray-700 mb-1">Due Amount: <span className="font-semibold">₹{fee.dueAmount}</span></div>
            <div className="text-gray-500 mb-1">Due Date: {fee.dueDate || 'N/A'}</div>
            {fee.status !== "Unpaid" && (
              <div className="mt-2">
                <div className="text-gray-700">Paid Amount: <span className="font-semibold">₹{fee.paidAmount}</span></div>
                <div className="text-gray-500 text-sm">Paid on {fee.paidDate || 'N/A'}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentFees; 