import React from "react";
import { useNavigate } from "react-router-dom";

function Header(){
  const navigate = useNavigate();
 
  return (
    <header className="flex flex-wrap gap-5 justify-between px-12 py-4 w-full bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.1)] max-md:px-5 max-md:max-w-full">
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
          className="px-6 py-3 text-indigo-700 rounded-lg border border-indigo-700 border-solid max-md:px-5"
          onClick={() => navigate("/login")} // Redirect to the login page
        >
          Student Login
        </button>
    
        <button className="self-start px-6 py-3.5 text-white bg-indigo-700 rounded-lg max-md:px-5">
          Admin Login
        </button>
      </nav>
    </header>
  );
}


function Hero() {
  return (
    <section className="self-center mt-16 w-full max-w-6xl max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col">
        <div className="w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col items-start w-full max-md:mt-10 max-md:max-w-full">
            <h2 className="text-5xl font-bold leading-[58px] text-zinc-800 max-md:text-4xl max-md:leading-[54px]">
              Transform Your Learning Experience
            </h2>
            <p className="self-stretch mt-3.5 text-xl leading-8 text-stone-500 max-md:max-w-full">
              EduLite provides a seamless educational platform that connects
              students and administrators in one intuitive interface.
            </p>
            <div className="flex gap-4 mt-7 text-lg text-center">
              <button className="px-8 py-3.5 text-white bg-indigo-700 rounded-lg max-md:px-5">
                Get Started
              </button>
              <button className="px-8 py-4 text-indigo-700 rounded-lg border border-indigo-700 border-solid max-md:px-5">
                Learn More
              </button>
            </div>
          </div>
        </div>
        <div className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <img
            src="https://img.freepik.com/free-vector/marketing-students-create-corporate-identity_335657-3061.jpg?t=st=1745122490~exp=1745126090~hmac=4b2f39e99526e2005da780b617dd543b1ef4a7cb50df1c929f5fb51ee1bc568e&w=996"
            alt="Learning platform interface"
            className="object-contain grow mt-5 w-full rounded-xl aspect-[1.5] shadow-[0px_4px_6px_rgba(0,0,0,0.1)] max-md:mt-10 max-md:max-w-full"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <article className="flex flex-col grow items-start px-8 py-8 w-full rounded-xl bg-stone-50 max-md:px-5 max-md:mt-8">
      <img
        src={icon}
        alt={`${title} icon`}
        className="object-contain w-12 aspect-square rounded-[33554400px]"
      />
      <h3 className="mt-4 text-xl font-semibold text-zinc-800">{title}</h3>
      <p className="mt-2.5 text-base leading-6 text-stone-500">{description}</p>
    </article>
  );
}

function Features() {
  const features = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/7c02700c222848e8b2439cb84e5fcfdc/40f2c773f55c47ca76e98a946d7fcdfc189da952?placeholderIfAbsent=true",
      title: "Easy to Use",
      description:
        "Intuitive interface designed for both students and administrators. Intuitive interface designed",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/7c02700c222848e8b2439cb84e5fcfdc/6cc700a28b037d985090c0cd449748a7619ba7c0?placeholderIfAbsent=true",
      title: "Collaborative Learning",
      description: "Work together with classmates on projects and assignments. Work together with",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/7c02700c222848e8b2439cb84e5fcfdc/d0711a9620a3883ea46e9d09b3c291e88c371ce9?placeholderIfAbsent=true",
      title: "Real-time Updates",
      description: "Stay informed with instant notifications and updates. Work together with classmates",
    },
  ];

  return (
    <section className="flex flex-col px-16 py-20 mt-20 w-full bg-white max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <h2 className="self-center text-4xl font-bold text-center text-zinc-800">
        Why Choose EduLite?
      </h2>
      <div className="mt-12 max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          {features.map((feature, index) => (
            <div key={index} className="w-[33%] max-md:ml-0 max-md:w-full">
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
      <h2 className="self-center mt-20 text-4xl font-bold text-center text-zinc-800 max-md:mt-10">
        What Students Say
      </h2>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-16 py-12 mt-32 w-full bg-zinc-800 max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col">
        <div className="w-[76%] max-md:ml-0 max-md:w-full">
          <div className="grow max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <div className="w-[39%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col max-md:mt-8">
                  <h3 className="self-start text-xl font-bold text-white">
                    EduLite
                  </h3>
                  <p className="mt-5 text-base leading-6 text-neutral-400">
                    Transforming education through technology.
                  </p>
                </div>
              </div>
              <nav className="ml-5 w-[18%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col items-start text-base text-neutral-400 max-md:mt-8">
                  <h3 className="self-stretch text-xl font-bold text-white">
                    Quick Links
                  </h3>
                  <a href="#" className="mt-4">
                    About Us
                  </a>
                  <a href="#" className="mt-2">
                    Features
                  </a>
                  <a href="#" className="mt-2">
                    Testimonials
                  </a>
                </div>
              </nav>
              <div className="ml-5 w-[43%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow text-base text-neutral-400 max-md:mt-8">
                  <nav className="flex flex-col items-start self-end max-md:mr-2.5">
                    <h3 className="text-xl font-bold text-white">Support</h3>
                    <a href="#" className="mt-4">
                      Help Center
                    </a>
                    <a href="#" className="mt-2">
                      Contact Us
                    </a>
                    <a href="#" className="self-stretch mt-2">
                      Privacy Policy
                    </a>
                  </nav>
                  <p className="mt-12 text-center max-md:mt-10">
                    © 2024 EduLite. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-5 w-[24%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col w-full whitespace-nowrap max-md:mt-10">
            <h3 className="self-start text-xl font-bold text-white">Connect</h3>
            <nav className="flex gap-3.5 mt-4 text-base text-neutral-400">
              <a href="#" className="grow">
                Twitter
              </a>
              <a href="#">LinkedIn</a>
              <a href="#">Facebook</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <main className="overflow-hidden bg-white">
      <div className="flex flex-col w-full bg-neutral-50 max-md:max-w-full">
        <Header />
        <Hero />
        <Features />
        <Footer />
      </div>
    </main>
  );
}

export default LandingPage;
