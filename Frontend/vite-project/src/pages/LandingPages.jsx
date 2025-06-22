import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGraduationCap, FaUsers, FaBook, FaChartLine, FaStar } from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
 
  return (
    <header className="fixed top-0 left-0 right-0 flex flex-wrap gap-5 justify-between px-12 py-4 w-full bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.1)] max-md:px-5 max-md:max-w-full z-50">
      <div className="flex gap-0.5 my-auto text-4xl font-bold leading-none text-black whitespace-nowrap">
        <img
          src="https://res.cloudinary.com/davztqz5k/image/upload/v1745123371/edulite_logo_figma_lcg648.png"
          alt="EduLite Logo"
          className="object-contain shrink-0 w-10 aspect-square"
        />
        <h1 className="basis-auto">EduLite</h1>
      </div>
      <nav className="flex gap-3.5 text-base text-center">
        <button
          className="px-6 py-3 text-indigo-700 rounded-lg border border-indigo-700 border-solid hover:bg-indigo-50 transition-colors duration-200 max-md:px-5"
          onClick={() => navigate("/login")}
        >
          Student Login
        </button>
        <button 
          className="self-start px-6 py-3.5 text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors duration-200 max-md:px-5"
          onClick={() => navigate("/admin/login")}
        >
          Admin Login
        </button>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-indigo-50 to-white">
      <div className="self-center mt-16 w-full max-w-6xl mx-auto px-4 max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <motion.div 
            className="w-6/12 max-md:ml-0 max-md:w-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col items-start w-full max-md:mt-10 max-md:max-w-full">
              <h2 className="text-5xl font-bold leading-[58px] text-zinc-800 max-md:text-4xl max-md:leading-[54px]">
                Transform Your Learning Experience
              </h2>
              <p className="self-stretch mt-3.5 text-xl leading-8 text-stone-500 max-md:max-w-full">
                EduLite provides a seamless educational platform that connects
                students and administrators in one intuitive interface.
              </p>
              <div className="flex gap-4 mt-7 text-lg text-center">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors duration-200 max-md:px-5"
                >
                  Get Started
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 text-indigo-700 rounded-lg border border-indigo-700 border-solid hover:bg-indigo-50 transition-colors duration-200 max-md:px-5"
                >
                  Learn More
                </motion.button>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="ml-5 w-6/12 max-md:ml-0 max-md:w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://img.freepik.com/free-vector/marketing-students-create-corporate-identity_335657-3061.jpg"
              alt="Learning platform interface"
              className="object-contain grow mt-5 w-full rounded-xl aspect-[1.5] shadow-[0px_4px_6px_rgba(0,0,0,0.1)] max-md:mt-10 max-md:max-w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { number: "10K+", label: "Active Students", icon: <FaUsers className="text-4xl text-indigo-600" /> },
    { number: "50+", label: "Courses", icon: <FaBook className="text-4xl text-indigo-600" /> },
    { number: "95%", label: "Success Rate", icon: <FaChartLine className="text-4xl text-indigo-600" /> },
    { number: "4.8", label: "Rating", icon: <FaStar className="text-4xl text-indigo-600" /> },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-xl bg-indigo-50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <h3 className="text-3xl font-bold text-indigo-700">{stat.number}</h3>
              <p className="mt-2 text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.article 
      className="flex flex-col grow items-start px-8 py-8 w-full rounded-xl bg-stone-50 hover:bg-indigo-50 transition-colors duration-200 max-md:px-5 max-md:mt-8"
      whileHover={{ y: -5 }}
    >
      <div className="p-3 bg-indigo-100 rounded-full">
        <img
          src={icon}
          alt={`${title} icon`}
          className="object-contain w-12 aspect-square"
        />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-zinc-800">{title}</h3>
      <p className="mt-2.5 text-base leading-6 text-stone-500">{description}</p>
    </motion.article>
  );
}

function Features() {
  const features = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/7c02700c222848e8b2439cb84e5fcfdc/40f2c773f55c47ca76e98a946d7fcdfc189da952?placeholderIfAbsent=true",
      title: "Easy to Use",
      description: "Intuitive interface designed for both students and administrators.",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/7c02700c222848e8b2439cb84e5fcfdc/6cc700a28b037d985090c0cd449748a7619ba7c0?placeholderIfAbsent=true",
      title: "Collaborative Learning",
      description: "Work together with classmates on projects and assignments.",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/7c02700c222848e8b2439cb84e5fcfdc/d0711a9620a3883ea46e9d09b3c291e88c371ce9?placeholderIfAbsent=true",
      title: "Real-time Updates",
      description: "Stay informed with instant notifications and updates.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center text-zinc-800 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why Choose EduLite?
        </motion.h2>
        <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      text: "EduLite has transformed my learning experience. The platform is intuitive and the resources are excellent."
    },
    {
      name: "Michael Chen",
      role: "Engineering Student",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      text: "The collaborative features make group projects so much easier. Highly recommended!"
    },
    {
      name: "Emily Rodriguez",
      role: "Business Student",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      text: "The real-time updates and notifications keep me on track with my studies. Great platform!"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center text-zinc-800 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What Students Say
        </motion.h2>
        <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl bg-indigo-50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-zinc-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-indigo-700">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2 
          className="text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Ready to Transform Your Learning Experience?
        </motion.h2>
        <motion.p 
          className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          Join thousands of students who are already using EduLite to enhance their education.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 text-indigo-700 bg-white rounded-lg font-semibold hover:bg-indigo-50 transition-colors duration-200"
          onClick={() => navigate("/login")}
        >
          Get Started Now
        </motion.button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-zinc-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-4 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1">
          <div>
            <h3 className="text-xl font-bold mb-4">EduLite</h3>
            <p className="text-neutral-400">
              Transforming education through technology.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2 text-neutral-400">
              <a href="#" className="hover:text-white transition-colors duration-200">About Us</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Features</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Testimonials</a>
            </nav>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Support</h3>
            <nav className="flex flex-col gap-2 text-neutral-400">
              <a href="#" className="hover:text-white transition-colors duration-200">Help Center</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            </nav>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <nav className="flex gap-4 text-neutral-400">
              <a href="#" className="hover:text-white transition-colors duration-200">
                <FaGraduationCap className="text-2xl" />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                <FaUsers className="text-2xl" />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                <FaBook className="text-2xl" />
              </a>
            </nav>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-zinc-700 text-center text-neutral-400">
          <p>© 2024 EduLite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
