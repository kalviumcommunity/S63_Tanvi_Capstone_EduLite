import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

const statusColors = {
  Completed: "bg-green-100 text-green-600",
  "In Progress": "bg-purple-100 text-purple-600",
  Unpaid: "bg-red-100 text-red-600",
  Partial: "bg-purple-100 text-purple-600",
  "Not Started": "bg-gray-100 text-gray-600",
};

const getProgressStatus = (course) => {
  if (!course.progress) return { text: "Not Started", color: statusColors["Not Started"] };
  if (course.progress >= 100) return { text: "Completed", color: statusColors["Completed"] };
  if (course.progress >= 50) return { text: "In Progress", color: statusColors["In Progress"] };
  return { text: "Partial", color: statusColors["Partial"] };
};

const CourseSkeleton = () => (
  <div className="bg-white rounded-xl shadow animate-pulse p-6">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="flex justify-end gap-4">
      <div className="h-8 bg-gray-200 rounded w-24"></div>
      <div className="h-8 bg-gray-200 rounded w-32"></div>
    </div>
  </div>
);

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/users/full-me");
        setCourses(res.data.enrolledCourses || []);
      } catch {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="flex gap-8 p-8">
      {/* Left Side - Courses List */}
      <div className="w-1/2">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-zinc-900">Your Enrolled Courses</h1>
          <p className="text-gray-500 mb-4">Continue learning from where you left off</p>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <CourseSkeleton key={i} />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            {searchTerm ? "No courses match your search" : "You are not enrolled in any courses yet"}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredCourses.map((course) => {
              const status = getProgressStatus(course);
              return (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow flex flex-col md:flex-row md:items-center justify-between px-8 py-6 gap-4"
                >
                  <div className="flex-1">
                    <div className="text-xl font-semibold text-zinc-900 mb-1">{course.name}</div>
                    {course.description && (
                      <div className="text-gray-500 text-sm mb-1">{course.description}</div>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="text-sm text-gray-600">
                        Progress: {course.progress || 0}%
                      </div>
                      {course.lastAccessed && (
                        <div className="text-sm text-gray-600">
                          Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${status.color}`}
                    >
                      {status.text}
                    </span>
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="px-8 py-2 text-base font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition w-full md:w-auto"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Side - Content */}
      <div className="w-1/2 bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Course Content</h2>
        {selectedCourse ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getProgressStatus(selectedCourse).color}`}>
                {getProgressStatus(selectedCourse).text}
              </span>
              <span className="text-gray-600">
                {selectedCourse.progress || 0}% Complete
              </span>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{selectedCourse.name}</h3>
              {selectedCourse.description && (
                <p className="text-gray-600">{selectedCourse.description}</p>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Last Accessed</p>
                  <p className="font-medium">
                    {selectedCourse.lastAccessed ? new Date(selectedCourse.lastAccessed).toLocaleDateString() : 'Never'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium">{selectedCourse.duration || 'Not specified'}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
                className="w-full px-6 py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition"
              >
                Continue Learning
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            Select a course to view its details
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourses; 