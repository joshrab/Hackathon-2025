import React, { useState } from "react";
import { Link } from "react-router-dom";

const ContributorCard = ({ name, role, image }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transition-transform hover:scale-105">
    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center">
      <span className="text-4xl">👤</span>
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{name}</h3>
    <p className="text-gray-600 text-center">{role}</p>
  </div>
);

const AboutPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const contributors = [
    { name: "Contributor 1", role: "Frontend Developer" },
    { name: "Contributor 2", role: "Backend Developer" },
    { name: "Contributor 3", role: "Data Scientist" },
    { name: "Contributor 4", role: "UI/UX Designer" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white" 
        : "bg-gradient-to-b from-blue-50 to-green-50 text-gray-800"
    }`}>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* About Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold mb-8 ${
            darkMode ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'
          }`}>
            About SafeRoute
          </h1>
          <p className={`text-xl leading-relaxed mb-8 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            SafeRoute is a destination routing application designed to prioritize user safety above all else. 
            By incorporating local traffic and accident data dating back to 2016, SafeRoute is able to generate 
            directions avoiding historically dangerous areas.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Back to Home
          </Link>
        </div>

        {/* Contributors Section */}
        <div className="mt-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {contributors.map((contributor, index) => (
              <ContributorCard
                key={index}
                name={contributor.name}
                role={contributor.role}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;