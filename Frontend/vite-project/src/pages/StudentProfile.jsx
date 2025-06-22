import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axiosInstance.get("/users/full-me");
        setStudent(res.data);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      const res = await axiosInstance.put("/users/profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      // Update the student state with new profile picture
      setStudent(prev => ({
        ...prev,
        profilePicture: res.data.profilePicture
      }));
      
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-700"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 p-4 bg-red-50 rounded-lg">
      {error}
    </div>
  );

  if (!student) return null;

  return (
    <div className="w-full p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-zinc-900">Profile Settings</h1>
        <p className="text-gray-500">Manage your personal information</p>
      </div>
      <div className="bg-white rounded-2xl shadow p-10 flex flex-col md:flex-row gap-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-start w-full md:w-1/3">
          <div className="relative w-40 h-40 mb-6">
            <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100">
              {student.profilePicture ? (
                <img
                  src={student.profilePicture}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Image Upload Section */}
          <div className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            
            {selectedFile && (
              <div className="text-sm text-gray-600">
                Selected: {selectedFile.name}
              </div>
            )}
            
            {uploadProgress > 0 && uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        </div>
        
        {/* Profile Information */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-500 text-sm mb-1 block">Full Name</label>
            <div className="text-lg font-semibold text-zinc-900">{student.name}</div>
          </div>
          <div>
            <label className="text-gray-500 text-sm mb-1 block">Email Address</label>
            <div className="text-lg font-semibold text-zinc-900">{student.email}</div>
          </div>
          <div>
            <label className="text-gray-500 text-sm mb-1 block">Phone Number</label>
            <div className="text-lg font-semibold text-zinc-900">{student.phone || 'N/A'}</div>
          </div>
          <div>
            <label className="text-gray-500 text-sm mb-1 block">Student ID</label>
            <div className="text-lg font-semibold text-zinc-900">{student._id}</div>
          </div>
          <div>
            <label className="text-gray-500 text-sm mb-1 block">Program</label>
            <div className="text-lg font-semibold text-zinc-900">{student.program || 'N/A'}</div>
          </div>
          <div>
            <label className="text-gray-500 text-sm mb-1 block">Batch</label>
            <div className="text-lg font-semibold text-zinc-900">{student.batch || '2023-2024'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile; 