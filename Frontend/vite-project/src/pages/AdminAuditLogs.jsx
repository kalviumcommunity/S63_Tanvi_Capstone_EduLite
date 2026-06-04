import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import axiosInstance from '../axiosInstance';
import { FaShieldAlt, FaFilter, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res = await axiosInstance.get('/audit-logs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = filterAction === 'ALL' || log.action === filterAction;
    
    return matchesSearch && matchesFilter;
  });

  const getActionColor = (action) => {
    if (action?.includes('DELETE')) return 'bg-red-100 text-red-700 border-red-200';
    if (action?.includes('UPDATE') || action?.includes('EDIT')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (action?.includes('ADD') || action?.includes('CREATE')) return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaShieldAlt className="text-indigo-600" />
            System Audit Logs
          </h1>
          <p className="text-sm text-gray-500">Track sensitive administrative actions</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs by user, action, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="relative w-full md:w-64">
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none"
              >
                <option value="ALL">All Actions</option>
                <option value="DELETE_STUDENT">Delete Student</option>
                <option value="UPDATE_FEE">Update Fee</option>
                <option value="ADD_COURSE">Add Course</option>
                <option value="UPDATE_COURSE">Update Course</option>
                <option value="DELETE_COURSE">Delete Course</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="space-y-4 py-8">
                {[1, 2, 3, 4, 5].map((skeleton) => (
                  <div key={skeleton} className="h-12 bg-gray-100 animate-pulse rounded-lg w-full"></div>
                ))}
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FaShieldAlt className="text-4xl text-gray-300 mx-auto mb-3" />
                <p>No audit logs found matching your criteria.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Date & Time</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Admin</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Action</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLogs.map((log, index) => (
                    <motion.tr 
                      key={log._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-800">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-800">
                          {log.performedBy?.name || 'Unknown Admin'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.performedBy?.email || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getActionColor(log.action)}`}>
                          {log.action?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md truncate">
                          {log.details || 'No additional details provided'}
                        </div>
                        {log.targetId && (
                          <div className="text-xs text-gray-400 font-mono mt-1">
                            Target ID: {log.targetId}
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAuditLogs;
