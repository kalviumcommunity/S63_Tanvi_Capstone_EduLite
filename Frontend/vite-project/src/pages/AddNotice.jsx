import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosInstance";

const AddNotice = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // You can adjust the endpoint as needed
      await axiosInstance.post("/admin/notifications", {
        title,
        description
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setLoading(false);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Failed to send notification.');
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow p-10 mt-10">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Create Notification</h1>
          <p className="mb-8 text-gray-500">Send notifications to students and faculty</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter notification title"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
                placeholder=""
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {error && <div className="text-red-600 bg-red-100 rounded-lg p-3">{error}</div>}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-400 text-white rounded-lg hover:bg-indigo-600 font-semibold disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Notification'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddNotice;
