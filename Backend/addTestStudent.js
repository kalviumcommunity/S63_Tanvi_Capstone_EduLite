const mongoose = require('mongoose');
const User = require('./models/user');
const Course = require('./models/course');

const MONGO_URI = 'mongodb+srv://tanviagarwals63:1234tanvi@edulite.9zovzao.mongodb.net/'; // Change if your DB URI is different

async function addTestStudent() {
  await mongoose.connect(MONGO_URI);

  // Create a test course if none exists
  let course = await Course.findOne();
  if (!course) {
    course = await Course.create({
      name: 'Web Development',
      description: 'Learn to build modern web apps',
      image: '',
      duration: 12,
      price: 5000,
      category: 'Development',
      enrolledStudents: []
    });
  }

  // Create a test student
  const student = new User({
    name: 'John Smith',
    email: 'john.smith@example.com',
    password: '2000-01-01', // Will be hashed by pre-save hook
    role: 'student',
    phone: '+1 (555) 123-4567',
    dob: new Date('2000-01-01'),
    profilePicture: '',
    enrolledCourses: [course._id],
    completedCourses: 3,
    feePaid: 15000,
    feeTotal: 20000,
    nextFeeDue: new Date('2025-04-30'),
    program: 'Computer Science',
    batch: '2023-2024',
  });

  await student.save();
  // Add student to course's enrolledStudents
  course.enrolledStudents.push(student._id);
  await course.save();

  console.log('Test student and course added!');
  await mongoose.disconnect();
}

addTestStudent().catch(console.error); 