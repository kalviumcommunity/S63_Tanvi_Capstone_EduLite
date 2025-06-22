import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    course: '',
    profilePhoto: null
  });
  const [courses, setCourses] = useState([]);
  const [formError, setFormError] = useState('');
  const [uploadLabel, setUploadLabel] = useState('Drag and drop your photo here or browse');

  useEffect(() => {
    // Fetch courses for dropdown
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/courses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        console.log('Courses API response:', response.data); // Debug log
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, profilePhoto: file }));
    setUploadLabel(file ? file.name : 'Drag and drop your photo here or browse');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFormData(prev => ({ ...prev, profilePhoto: file }));
    setUploadLabel(file ? file.name : 'Drag and drop your photo here or browse');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('dob', formData.dob);
    data.append('course', formData.course);
    if (formData.profilePhoto) data.append('profilePhoto', formData.profilePhoto);
    try {
      await axios.post('http://localhost:5000/api/admin/users', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/admin/students');
    } catch (error) {
      setFormError(error.response?.data?.error || 'Failed to add student');
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow p-10">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Add New Student</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter email address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter phone number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Course</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="" disabled>Select course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Profile Photo</label>
                <div
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer bg-gray-50"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById('profilePhotoInput').click()}
                  style={{ minHeight: '120px' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4a1 1 0 01-1-1v-1a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1z" /></svg>
                  <span>{uploadLabel}</span>
                  <input
                    id="profilePhotoInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
              {formError && <div className="text-red-600 bg-red-100 rounded-lg p-3">{formError}</div>}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/admin/students')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 font-semibold"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddStudent; 