import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { FaPlus, FaPencilAlt, FaTrash, FaUsers, FaClock, FaTag, FaImage, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const CourseCard = ({ course, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    {/* Course Image */}
    <div className="h-48 w-full overflow-hidden relative">
      <img
        src={course.image ? `http://localhost:5000${course.image}` : 'https://via.placeholder.com/400x200?text=No+Image'}
        alt={course.name}
        className="w-full h-full object-cover"
      />
      {!course.image && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <FaImage className="text-gray-400 text-4xl" />
        </div>
      )}
    </div>
    
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{course.name}</h3>
          <p className="text-gray-600 mt-1 line-clamp-2">{course.description}</p>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FaClock />
              <span>{course.duration} weeks</span>
            </div>
            <div className="flex items-center gap-1">
              <FaTag />
              <span>{course.category}</span>
            </div>
            <div className="text-indigo-600 font-semibold">
              ${course.price}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(course)}
            className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
          >
            <FaPencilAlt />
          </button>
          <button
            onClick={() => onDelete(course._id)}
            className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center text-gray-600">
        <FaUsers className="mr-2" />
        <span>{course.enrolledStudents?.length || 0} Students</span>
      </div>
    </div>
  </div>
);

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    category: '',
    image: null
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', duration: '', price: '', category: '', image: null });
  const [editFormError, setEditFormError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEdit = (course) => {
    setEditCourse(course);
    setEditForm({
      name: course.name || '',
      description: course.description || '',
      duration: course.duration || '',
      price: course.price || '',
      category: course.category || '',
      image: null
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
    setEditForm(prev => ({ ...prev, image: file }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditFormError('');
    const data = new FormData();
    data.append('name', editForm.name);
    data.append('description', editForm.description);
    data.append('duration', editForm.duration);
    data.append('price', editForm.price);
    data.append('category', editForm.category);
    if (editForm.image) data.append('image', editForm.image);
    try {
      await axios.put(`http://localhost:5000/api/courses/${editCourse._id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setEditModalOpen(false);
      setEditCourse(null);
      // Refresh courses
      const response = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setCourses(response.data);
    } catch (error) {
      setEditFormError(error.response?.data?.error || 'Failed to update course');
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setCourses(courses.filter(c => c._id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleImageChange = (e) => {
    setNewCourse({ ...newCourse, image: e.target.files[0] });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      const formData = new FormData();
      formData.append('name', newCourse.name);
      formData.append('description', newCourse.description);
      formData.append('duration', newCourse.duration);
      formData.append('price', newCourse.price);
      formData.append('category', newCourse.category);
      if (newCourse.image) {
        formData.append('image', newCourse.image);
      }

      const response = await axios.post('http://localhost:5000/api/courses', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setCourses([...courses, response.data.course]);
      setShowAddModal(false);
      setNewCourse({
        name: '',
        description: '',
        duration: '',
        price: '',
        category: '',
        image: null
      });
    } catch (error) {
      console.error('Error adding course:', error);
      setFormError(error.response?.data?.error || 'Failed to add course. Please try again.');
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
          <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaPlus />
            <span>Add New Course</span>
          </button>
        </div>

        {/* Course List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Add Course Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
              {formError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {formError}
                </div>
              )}
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Name</label>
                  <input
                    type="text"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (weeks)</label>
                  <input
                    type="number"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                </div>
                <div className="flex justify-end gap-2">
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
                    Add Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Course Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Edit Course</h2>
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
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (weeks)</label>
                  <input
                    type="number"
                    name="duration"
                    value={editForm.duration}
                    onChange={handleEditInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={editForm.category}
                    onChange={handleEditInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <input
                    type="file"
                    name="image"
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
                    Update Course
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

export default AdminCourses; 