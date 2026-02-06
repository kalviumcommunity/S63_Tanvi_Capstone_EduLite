# EduLite

> A lightweight, intuitive web-based Institute Management System built with the MERN stack.

[![Frontend](https://img.shields.io/website?label=Frontend&url=https%3A%2F%2Fedulitebytanvi.netlify.app)](https://edulitebytanvi.netlify.app/)
[![Backend](https://img.shields.io/website?label=Backend&url=https%3A%2F%2Fs63-tanvi-capstone-edulite-3.onrender.com)](https://s63-tanvi-capstone-edulite-3.onrender.com)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Target Audience](#target-audience)

---

## 🎯 Overview

EduLite is a comprehensive Institute Management System designed to streamline administrative operations for educational institutions. With separate dashboards for administrators and students, EduLite enables efficient management of courses, student records, and financial transactions in a simple, intuitive interface.

---

## 🔍 Problem Statement

Many small and mid-sized educational institutions still rely on manual, paper-based processes to manage:
- Student records and registrations
- Course information and enrollments
- Fee payments and financial tracking

This traditional approach leads to:
- **Disorganized data** and duplicate records
- **Human errors** and inconsistencies
- **Delayed fee tracking** and reporting
- **Inefficient workflows** and wasted administrative time

---

## 💡 Solution

EduLite provides a centralized, digital platform that:
- **Automates** routine administrative tasks
- **Centralizes** all institutional data in one place
- **Improves** transparency and communication
- **Reduces** paperwork and manual entry errors
- **Empowers** both administrators and students with real-time access to information

---

## ✨ Features

### 👨‍💼 Admin Dashboard
- ✅ **Course Management** – Add, view, and delete courses
- ✅ **Student Management** – Add, view, and delete student records
- ✅ **Enrollment** – Assign students to courses
- ✅ **Fee Management** – Record and track student fee payments
- ✅ **Financial Reporting** – View detailed fee status and generate reports
- ✅ **Analytics** – Dashboard analytics and insights (Chart.js)

### 👨‍🎓 Student Dashboard
- ✅ **Enrolled Courses** – View all assigned courses
- ✅ **Fee Tracking** – View payment history and status (Paid/Unpaid/Partial)
- ✅ **Profile Management** – View and edit personal information
- ✅ **Notifications** – Stay updated with important announcements
- ✅ **Payment Transparency** – Clear visibility of financial obligations

---

## 🛠️ Technology Stack

### Frontend
- **React.js** – Modern UI library
- **Vite** – Fast build tool and dev server
- **Tailwind CSS** – Utility-first styling framework
- **React Router** – Client-side routing
- **Axios** – HTTP client for API communication

### Backend
- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **JWT** – JSON Web Tokens for authentication
- **Cloudinary** – Cloud-based image storage (profile photos)

### Deployment
- **Frontend** – Netlify
- **Backend** – Render
- **Database** – MongoDB Atlas

---

## 📁 Project Structure

```
EduLite/
├── Backend/
│   ├── models/               # MongoDB schemas
│   │   ├── admin.js
│   │   ├── student.js
│   │   ├── course.js
│   │   ├── user.js
│   │   └── notification.js
│   ├── adminRoutes.js        # Admin endpoints
│   ├── studentRoutes.js      # Student endpoints
│   ├── courseRoutes.js       # Course endpoints
│   ├── authMiddleware.js     # Authentication/Authorization
│   ├── server.js             # Express server
│   └── package.json
│
├── Frontend/
│   └── vite-project/
│       ├── src/
│       │   ├── components/
│       │   │   ├── AdminLayout.jsx
│       │   │   ├── StudentLayout.jsx
│       │   │   └── Navbar.jsx
│       │   ├── pages/
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── AdminCourses.jsx
│       │   │   ├── AdminStudents.jsx
│       │   │   ├── StudentDashboard.jsx
│       │   │   ├── StudentCourses.jsx
│       │   │   ├── StudentProfile.jsx
│       │   │   └── ...
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   └── axiosInstance.js
│       ├── public/
│       ├── package.json
│       └── vite.config.js
│
└── readme.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create .env file with:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# CLOUDINARY_API_KEY=your_cloudinary_key
# (and other required environment variables)

# Start the server
npm start
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend/vite-project

# Install dependencies
npm install

# Create .env file with:
# VITE_API_BASE_URL=http://localhost:5000

# Start development server
npm run dev
```

---

## 🌐 Deployment

### Live Links
- **Frontend:** [https://edulitebytanvi.netlify.app](https://edulitebytanvi.netlify.app)
- **Backend API:** [https://s63-tanvi-capstone-edulite-3.onrender.com](https://s63-tanvi-capstone-edulite-3.onrender.com)

### Deploy Instructions

**Frontend (Netlify):**
```bash
npm run build
# Deploy the dist/ folder to Netlify
```

**Backend (Render):**
- Connect your GitHub repository
- Set environment variables in Render dashboard
- Trigger automatic deployment on push

---

## 👥 Target Audience

- 🏫 Small to mid-sized educational institutes
- 🎓 Coaching centers and private tutors
- 💻 Online learning platforms seeking lightweight management tools
- 📚 Training centers and educational nonprofits

---

## 📊 Development Timeline

This project was completed following a structured 30-day development plan:

| Week | Focus | Days |
|------|-------|------|
| 1 | Planning, Setup & Architecture | 1-7 |
| 2 | Admin Module Development | 8-14 |
| 3 | Student Module Development | 15-21 |
| 4 | Testing, Polish & Deployment | 22-30 |

---

## 📝 License

This project is created as part of a capstone assignment.

---

## 👩‍💻 Author

**Tanvi Agarwal** – Capstone Project (S63)

---

## 🤝 Support

For issues, questions, or suggestions, please feel free to reach out.




