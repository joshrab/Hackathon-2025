import React from 'react';
import { Link } from 'react-router-dom';
import RouteComparison from '../components/RouteComparison';

// Icon components
const IconShield = () => <span className="text-3xl">🛡️</span>;
const IconNavigation = () => <span className="text-3xl">🧭</span>;
const IconHeart = () => <span className="text-3xl">💝</span>;
const IconCar = () => <span className="text-3xl">🚗</span>;
const IconCity = () => <span className="text-3xl">🌆</span>;
const IconFamily = () => <span className="text-3xl">👨‍👩‍👧‍👦</span>;

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
    <div className="p-3 bg-blue-50 rounded-full mb-4">
      <Icon />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

const UserCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center p-8 bg-white/90 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-full mb-6">
      <Icon />
    </div>
    <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
    <p className="text-gray-600 text-center leading-relaxed">{description}</p>
  </div>
);

const Home = () => (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
    {/* Hero Section */}
    <div className="flex flex-col items-center justify-center pt-20 pb-16 px-4">
      <div className="bg-white/30 p-8 rounded-2xl backdrop-blur-sm max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Your Safety is Our Priority
        </h1>
        <p className="text-xl mb-8 text-center max-w-2xl mx-auto text-gray-700 leading-relaxed">
          Navigate with confidence using SafeRoute. We analyze historical traffic data
          to create the safest path to your destination, helping you avoid high-risk areas
          and arrive safely, every time.
        </p>
        <div className="flex justify-center">
          <Link
            to="/map"
            className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Plan Your Safe Route
          </Link>
        </div>
      </div>
    </div>

    {/* Features Section */}
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={IconShield}
          title="Safety First"
          description="Our routes are optimized using comprehensive accident data analysis to prioritize your safety above all else."
        />
        <FeatureCard
          icon={IconNavigation}
          title="Smart Navigation"
          description="Advanced algorithms process historical traffic patterns to identify and avoid high-risk areas on your journey."
        />
        <FeatureCard
          icon={IconHeart}
          title="Peace of Mind"
          description="Travel with confidence knowing you're taking the safest possible route to your destination."
        />
      </div>
    </div>

    {/* Route Comparison */}
    <RouteComparison />

    {/* Perfect For Section */}
    <div className="py-16 px-4 bg-gradient-to-r from-blue-500/10 to-green-500/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Perfect For Your Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UserCard
            icon={IconCar}
            title="New Drivers"
            description="Build confidence on the road with routes that avoid challenging intersections and high-risk areas, making your early driving experiences safer and less stressful."
          />
          <UserCard
            icon={IconCity}
            title="New to the City"
            description="Unfamiliar with local traffic patterns? SafeRoute guides you through the safest paths in your new city, helping you avoid accident-prone areas while you learn the layout."
          />
          <UserCard
            icon={IconFamily}
            title="Safety-Conscious Travelers"
            description="Whether you're driving with family or simply prefer a more cautious approach, our routes prioritize your safety over saving a few minutes."
          />
        </div>
      </div>
    </div>

    {/* Statistics Section */}
    <div className="bg-blue-600 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Why Choose SafeRoute?</h2>
        <p className="text-xl mb-4 leading-relaxed">
          Motor vehicle crashes are the second leading cause of death from unintentional
          injuries in the United States. Our mission is to change this statistic by
          providing you with safer routing options.
        </p>
        <p className="text-lg opacity-90">
          Every route is analyzed using real accident data to help you make informed
          decisions about your journey.
        </p>
      </div>
    </div>
  </div>
);

export default Home;