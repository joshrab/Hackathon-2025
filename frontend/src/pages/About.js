import React, { useState } from "react";
import { Link } from "react-router-dom";

const ContributorCard = ({ name, role, image, bio }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transition-transform hover:scale-105">
    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover"
      />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{name}</h3>
    <p className="text-gray-600 text-center font-medium mb-2">{role}</p>
    <p className="text-sm text-gray-500 text-center italic">{bio}</p>
  </div>
);

const AboutPage = () => {
  const [darkMode] = useState(false);

  const contributors = [
    { 
      name: "Ethan", 
      role: "Frontend",
      image: "/Ethan.png",
      bio: "I'm a sophomore at Duke University studying Computer Science and Journalism. My favorite things to do in my free time are to go on hikes, listen to Daft Punk, and read world news analysis."
    },
    { 
      name: "Billy", 
      role: "Contributor",
      image: "/Billy.png",
      bio: "I enjoy long walks at the beach and eating scones at the seaside bakery. I also like jellyfish."
    },
    { 
      name: "Will", 
      role: "Contributor",
      image: "/Will.png",
      bio: "My name's Will and I enjoy board games and drinking a nice cold cup of water with ice cubes (not crushed) on a hot day in the sun."
    },
    { 
      name: "Josh", 
      role: "Contributor",
      image: "/Josh.png",
      bio: "I'm Josh, a sophomore at Duke studying Computer Science with a concentration in AI/ML. I love traveling, exploring nature, and sushi."
    }
  ]

  const DataSection = ({ darkMode }) => (
    <div className={`max-w-4xl mx-auto mt-20 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg ${
      darkMode ? 'bg-gray-800/80' : ''
    }`}>
      <h2 className={`text-3xl font-bold text-center mb-8 ${
        darkMode ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'
      }`}>
        Our Data
      </h2>

      <div className="space-y-8">
        {/* Dataset Overview */}
        <div className="space-y-4">
          <h3 className={`text-xl font-semibold text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            About SafeRoute
          </h3>
          <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            SafeRoute leverages a comprehensive nationwide traffic accident dataset covering 49 states 
            in the United States. This extensive database includes approximately 7.7 million accident 
            records collected from February 2016 to March 2023.
          </p>
        </div>

        {/* Data Collection */}
        <div className="space-y-4">
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Data Sources
          </h3>
          <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            The data is sourced through multiple traffic APIs and includes information from:
          </p>
          <ul className={`list-disc pl-6 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>US and State Departments of Transportation</li>
            <li>Law Enforcement Agencies</li>
            <li>Traffic Cameras and Sensors</li>
            <li>Road Network Monitoring Systems</li>
          </ul>
        </div>

        {/* Important Notes */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Important Notes About Our Data
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 mt-2 mr-2 bg-blue-500 rounded-full"></span>
              <span>While our dataset is extensive, there may be gaps in data collection for certain days due to network connectivity issues.</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 mt-2 mr-2 bg-blue-500 rounded-full"></span>
              <span>The dataset covers the Contiguous United States, providing broad geographic coverage for route safety analysis.</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 mt-2 mr-2 bg-blue-500 rounded-full"></span>
              <span>Our route optimization considers historical accident patterns to suggest safer travel options.</span>
            </li>
          </ul>
        </div>

        {/* Acknowledgments */}
        <div className="mt-8 p-6 border border-gray-200 rounded-xl">
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Acknowledgments
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            This application uses the US-Accidents dataset created by Sobhan Moosavi, Mohammad Hossein 
            Samavatian, Srinivasan Parthasarathy, Radu Teodorescu, and Rajiv Ramnath. The dataset is 
            distributed under the Creative Commons Attribution-Noncommercial-ShareAlike license 
            (CC BY-NC-SA 4.0) for research purposes.
          </p>
        </div>
      </div>
    </div>
  );

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
        {/* Data Section */}
        <DataSection darkMode={darkMode} />

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
                image={contributor.image}
                bio={contributor.bio}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;