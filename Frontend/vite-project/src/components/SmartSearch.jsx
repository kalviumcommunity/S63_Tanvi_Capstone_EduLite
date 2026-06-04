import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { FaSearch, FaTimes, FaUser, FaBook } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ students: [], courses: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setIsOpen(true);
    try {
      const response = await axiosInstance.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      } else {
        setIsOpen(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const closeSearch = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <form onSubmit={onSubmit} className="relative flex items-center">
        <FaSearch className="absolute left-3 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Smart search (e.g. 'unpaid', 'low enrollment', name)"
          className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none shadow-sm transition-all text-gray-700 bg-white"
        />
        <button
          type="submit"
          className="absolute right-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          Search
        </button>
      </form>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-4 bg-gray-50 flex justify-between items-center border-b">
              <span className="text-sm font-medium text-gray-500">Search Results</span>
              <button onClick={closeSearch} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>

            {loading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="p-2">
                {results.students.length === 0 && results.courses.length === 0 && (
                  <p className="p-4 text-center text-gray-500">No results found.</p>
                )}

                {results.students.length > 0 && (
                  <div className="mb-4">
                    <h4 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Students</h4>
                    {results.students.map((student) => (
                      <div key={student._id} className="flex items-center p-3 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3 text-indigo-600">
                          <FaUser />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                        {student.feeTotal - student.feePaid > 0 && (
                          <span className="ml-auto text-xs font-medium bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            Due: ₹{student.feeTotal - student.feePaid}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {results.courses.length > 0 && (
                  <div>
                    <h4 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Courses</h4>
                    {results.courses.map((course) => (
                      <div key={course._id} className="flex items-center p-3 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors">
                        <div className="bg-purple-100 p-2 rounded-full mr-3 text-purple-600">
                          <FaBook />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{course.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearch;
