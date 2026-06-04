# EduLite

> A lightweight, intuitive, and feature-rich web-based Institute Management System built with the MERN stack.

[![Frontend](https://img.shields.io/website?label=Frontend&url=https%3A%2F%2Fedulitebytanvi.netlify.app)](https://edulitebytanvi.netlify.app/)
[![Backend](https://img.shields.io/website?label=Backend&url=https%3A%2F%2Fs63-tanvi-capstone-edulite-3.onrender.com)](https://s63-tanvi-capstone-edulite-3.onrender.com)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Core & Advanced Features](#-core--advanced-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Target Audience](#-target-audience)

---

## 🎯 Overview

EduLite is a comprehensive Institute Management System designed to streamline administrative operations for educational institutions. Featuring distinct interfaces for administrators and students, EduLite enables efficient management of courses, student records, fee logs, real-time activity tracking, automated notifications, and online fee payments.

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

## ✨ Core & Advanced Features

### 👨‍💼 Admin Dashboard
- ✅ **Course Management** – Add, view, and delete courses.
- ✅ **Student Management** – Add, view, and delete student records.
- ✅ **Enrollment** – Assign students to courses.
- ✅ **Fee Management** – Record, track, and manage student fee payments.
- ✅ **Financial Reporting** – View detailed fee status and generate reports.
- ✅ **Analytics** – Dashboard analytics and insights using Chart.js.
- ✅ **Smart Global Search** – Custom query-driven search box matching terms like `"unpaid"`, `"low enrollment"`, or student names/emails.
- ✅ **Real-Time Activity Feed** – Dynamic component displaying server events and administrative actions as they happen via Socket.IO.
- ✅ **Reminders Panel** – Create email and WhatsApp payment reminder campaigns for students.
- ✅ **Audit Trail** – Comprehensive logs of admin operations for system accountability.

### 👨‍🎓 Student Dashboard
- ✅ **Enrolled Courses** – View all assigned courses.
- ✅ **Fee Tracking** – View payment history and status (Paid/Unpaid/Partial).
- ✅ **Stripe Payments Integration** – Pay tuition fees securely online (full or custom partial amounts) with redirect validation.
- ✅ **Gamification Widget** – Earn points (+50 points per fee payment) to level up and compete on the student leaderboard.
- ✅ **Reminders System** – View pending action items and due dates on the dashboard.
- ✅ **Profile Management** – View and edit personal details and upload profile photos.
- ✅ **Notifications** – Stay updated with important announcements.

### 🌐 System Resilience
- ✅ **Offline Mode Overlay** – A global component that monitors network state, offering a connection countdown and simulated reconnect queues during network failures.

---

## 🛠️ Technology Stack

### Frontend
- **React.js** (v19) – Component-based UI library
- **Vite** – Fast bundler and dev server
- **Tailwind CSS** – Styling and layouts
- **Framer Motion** – Dynamic animations and micro-interactions
- **Socket.io-client** – Real-time event communication
- **React Router** – Client-side routing
- **Axios** – HTTP communication with the API

### Backend
- **Node.js** – JavaScript runtime
- **Express.js** – Web application framework
- **MongoDB & Mongoose** – Object Data Modeling (ODM) for database operations
- **Socket.io** – Real-time WebSocket server integration
- **Stripe SDK** – Payment gateway integration
- **node-cron** – Task scheduling for notifications
- **Nodemailer** – Transactional email dispatcher (supports SMTP / Mailtrap)
- **JWT** – JSON Web Tokens for authentication
- **Cloudinary** – Cloud-based storage for profile photos

### Deployment & Services
- **Frontend** – Netlify
- **Backend** – Render
- **Database** – MongoDB Atlas

---

## 📁 Project Structure

```
EduLite/
├── Backend/
│   ├── cron/                 # Automated cron jobs
│   │   └── scheduler.js      # Periodically sends due reminders
│   ├── models/               # MongoDB Schemas
│   │   ├── admin.js
│   │   ├── student.js
│   │   ├── course.js
│   │   ├── user.js           # Shared user accounts (gamification stats included)
│   │   ├── notification.js
│   │   ├── Reminder.js       # Student reminder logs
│   │   ├── AuditLog.js       # Admin action audits
│   │   └── ActivityLog.js    # Global dashboard actions
│   ├── activityRoutes.js     # Live activity feed endpoints
│   ├── adminRoutes.js        # Admin endpoints
│   ├── auditRoutes.js        # Audit trail endpoints
│   ├── authMiddleware.js     # JWT validation middleware
│   ├── cloudinaryConfig.js   # Cloudinary file upload storage helper
│   ├── courseRoutes.js       # Course endpoints
│   ├── gamificationRoutes.js # Gamification leaderboard endpoints
│   ├── googleAuth.js         # Passport Google Strategy config
│   ├── googleRoutes.js       # Google OAuth flow routes
│   ├── paymentRoutes.js      # Stripe session & webhook confirmation routes
│   ├── reminderRoutes.js     # Reminder management routes
│   ├── searchRoutes.js       # Smart search execution endpoints
│   ├── studentRoutes.js      # Student endpoints
│   ├── userRoutes.js         # User profiles & authentication
│   ├── server.js             # Entrypoint integrating Express, WebSockets, & DB connection
│   └── package.json
│
├── Frontend/
│   └── vite-project/
│       ├── src/
│       │   ├── components/
│       │   │   ├── AdminLayout.jsx      # Navigation layout for Admin
│       │   │   ├── StudentLayout.jsx    # Navigation layout for Students
│       │   │   ├── Navbar.jsx
│       │   │   ├── SmartSearch.jsx      # Global query engine component
│       │   │   ├── RealtimeFeed.jsx     # Live feed socket client
│       │   │   ├── StudentReminders.jsx # Student dashboard reminder view
│       │   │   ├── GamificationWidget.jsx # Student points and level component
│       │   │   ├── OfflineBanner.jsx    # Connectivity listener banner
│       │   │   └── MockPaymentModal.jsx
│       │   ├── pages/
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── AdminCourses.jsx
│       │   │   ├── AdminStudents.jsx
│       │   │   ├── AdminReminders.jsx   # Admin campaign builder
│       │   │   ├── AdminAuditLogs.jsx   # System events monitoring
│       │   │   ├── StudentDashboard.jsx
│       │   │   ├── StudentCourses.jsx
│       │   │   ├── StudentProfile.jsx
│       │   │   ├── StudentFees.jsx      # Stripe fee processing component
│       │   │   ├── PaymentSuccess.jsx   # Post-payment outcome view
│       │   │   └── ...
│       │   ├── App.jsx                  # React Router mapping
│       │   ├── main.jsx
│       │   └── axiosInstance.js         # Global Axios configurations
│       ├── package.json
│       └── vite.config.js
│
└── readme.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string (Atlas or local instance)
- Stripe Account (for test/secret keys)
- Cloudinary Account (for image uploads)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend/` folder and populate it:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/edulite
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   SESSION_SECRET=your_session_secret
   PORT=5001
   
   # Cloudinary (Profile Uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Stripe Payments
   STRIPE_SECRET_KEY=your_stripe_secret_key
   FRONTEND_URL=http://localhost:5173

   # Nodemailer SMTP Configuration (e.g., Mailtrap for development)
   MAILTRAP_USER=your_mailtrap_user
   MAILTRAP_PASS=your_mailtrap_password
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend/vite-project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `Frontend/vite-project/` and populate it:
   ```env
   VITE_API_BASE_URL=http://localhost:5001/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment

### Frontend (Netlify)
1. Build the production application bundle:
   ```bash
   npm run build
   ```
2. Upload the generated `dist/` directory to Netlify or configure automated Github triggers.

### Backend (Render)
1. Set up a Web Service on Render and link the GitHub repository.
2. In the Render Dashboard, add all key-value pairs matching the backend `.env` file configurations.
3. Configure build commands (`npm install`) and start commands (`npm start`).

---

## 👥 Target Audience

- 🏫 Small to mid-sized educational institutes seeking centralized student profiles.
- 🎓 Coaching centers and private academies needing automated billing and notifications.
- 💻 Online learning platforms looking for engagement tools and leaderboard reward modules.
