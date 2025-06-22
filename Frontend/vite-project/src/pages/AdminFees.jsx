import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FeeRecord = ({ student }) => {
  const navigate = useNavigate();

  const handleRecordPayment = () => {
    navigate('/admin/record-fee-payment', { 
      state: { 
        studentId: student.id,
        studentName: student.name,
        course: student.course
      } 
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{student.name}</h3>
          <p className="text-gray-600">{student.course}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          student.status === 'Paid' 
            ? 'bg-green-100 text-green-800'
            : student.status === 'Partial'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {student.status}
        </span>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Amount Due:</span>
          <span className="font-semibold">${student.amountDue}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Due Date:</span>
          <span>{student.dueDate}</span>
        </div>
      </div>
      <div className="mt-4">
        <button 
          onClick={handleRecordPayment}
          className="w-full px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50"
        >
          Record Payment
        </button>
      </div>
    </div>
  );
};

const AdminFees = () => {
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeeRecords = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/fees', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setFeeRecords(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching fee records:', error);
        setError('Failed to fetch fee records');
        setLoading(false);
      }
    };

    fetchFeeRecords();
  }, []);

  const handleNewPayment = () => {
    navigate('/admin/record-fee-payment');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Fee Management</h1>
          <button 
            onClick={handleNewPayment}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaPlus />
            <span>Record Payment</span>
          </button>
        </div>

        {/* Fee Records */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feeRecords.map((record) => (
            <FeeRecord key={record.id} student={record} />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFees; 