import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { FaUserPlus, FaCopy, FaPencilAlt, FaTrash, FaTimes } from 'react-icons/fa';
import axiosInstance from "../axiosInstance";
import { useNavigate } from 'react-router-dom';

const getProfileImageUrl = (profilePicture) => {
  if (!profilePicture) return 'https://ui-avatars.com/api/?background=random'; // fallback avatar
  // If it's a Cloudinary URL, use it directly; otherwise, use fallback
  return profilePicture.startsWith('http') ? profilePicture : 'https://ui-avatars.com/api/?background=random';
};

const StudentCard = ({ student, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          {/* Profile Image */}
          <img
            src={getProfileImageUrl(student.profilePicture)}
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
            onError={(e) => {
              e.target.src = 'https://ui-avatars.com/api/?background=random';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-800">{student.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                student.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
              }`}>
                {student.role}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{student.email}</p>
            <p className="text-gray-600">Completed Courses: {student.completedCourses || 0}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(student)}
            className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
          >
            <FaPencilAlt />
          </button>
          <button
            onClick={() => onDelete(student._id)}
            className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100"
          >
            <FaTrash />
          </button>
          <button className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100">
            <FaCopy />
          </button>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">Enrolled Courses</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
            student.enrolledCourses.map((course) => (
              <span key={course._id} className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                {course.name}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No courses enrolled</span>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    dob: '',
    courses: []
  });
  const [formError, setFormError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    dob: '', 
    courses: [], 
    profilePhoto: null 
  });
  const [editFormError, setEditFormError] = useState('');
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get("/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const regularUsers = response.data.filter(user => user.role !== 'admin');
      setStudents(regularUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students');
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get("/admin/courses", {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setCourses(response.data);
    } catch {
      setCourses([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCourseSelection = (courseId) => {
    setFormData(prev => {
      const currentCourses = prev.courses || [];
      if (currentCourses.includes(courseId)) {
        // Remove course if already selected
        return { ...prev, courses: currentCourses.filter(id => id !== courseId) };
      } else {
        // Add course if not selected
        return { ...prev, courses: [...currentCourses, courseId] };
      }
    });
  };

  const handleEditCourseSelection = (courseId) => {
    setEditForm(prev => {
      const currentCourses = prev.courses || [];
      if (currentCourses.includes(courseId)) {
        // Remove course if already selected
        return { ...prev, courses: currentCourses.filter(id => id !== courseId) };
      } else {
        // Add course if not selected
        return { ...prev, courses: [...currentCourses, courseId] };
      }
    });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      data.append('dob', formData.dob);
      data.append('courses', JSON.stringify(formData.courses));

      const response = await axiosInstance.post("/admin/users", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });

      if (response.data) {
        setStudents([...students, response.data.user]);
        setShowAddModal(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          dob: '',
          courses: []
        });
      }
    } catch (error) {
      console.error('Error adding student:', error);
      setFormError(error.response?.data?.error || 'Failed to add student');
    }
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    // Format the date properly for the input field
    const formattedDob = student.dob ? new Date(student.dob).toISOString().split('T')[0] : '';
    
    // Extract course IDs from enrolledCourses
    const courseIds = student.enrolledCourses ? student.enrolledCourses.map(course => course._id) : [];
    
    setEditForm({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      dob: formattedDob,
      courses: courseIds,
      profilePhoto: null
    });
    setEditFormError('');
    setEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    setEditForm(prev => ({ ...prev, profilePhoto: file }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditFormError('');
    
    const data = new FormData();
    data.append('name', editForm.name);
    data.append('email', editForm.email);
    data.append('phone', editForm.phone);
    data.append('dob', editForm.dob);
    data.append('courses', JSON.stringify(editForm.courses)); // Send as JSON string
    if (editForm.profilePhoto) data.append('profilePhoto', editForm.profilePhoto);
    
    try {
      await axiosInstance.put(`/admin/users/${editStudent._id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setEditModalOpen(false);
      setEditStudent(null);
      fetchStudents(); // Refresh the list
    } catch (error) {
      setEditFormError(error.response?.data?.error || 'Failed to update student');
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axiosInstance.delete(`/admin/users/${studentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setStudents(students.filter(s => s._id !== studentId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
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
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <button 
            onClick={() => navigate('/admin/students/add')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaUserPlus />
            <span>Add New User</span>
          </button>
        </div>

        {/* Student List */}
        <div className="grid grid-cols-1 gap-6">
          {students.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Add New Student</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Courses</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {courses.map(course => (
                      <label key={course._id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.courses.includes(course._id)}
                          onChange={() => handleCourseSelection(course._id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{course.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {formData.courses.length} course(s)
                  </p>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Edit Student</h2>
                <button 
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              {editFormError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {editFormError}
                </div>
              )}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={editForm.dob}
                      onChange={handleEditInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Courses</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {courses.map(course => (
                      <label key={course._id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.courses.includes(course._id)}
                          onChange={() => handleEditCourseSelection(course._id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{course.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {editForm.courses.length} course(s)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                  <input
                    type="file"
                    name="profilePhoto"
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Update Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStudents; 