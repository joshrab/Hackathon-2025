// frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 px-4">
    <h1 className="text-6xl font-extrabold mb-4 text-center">Welcome to SafeRoute</h1>
    <p className="text-xl mb-8 text-center max-w-2xl">
      Motor vehicle crashes are the second leading cause of death from unintentional injuries in the United States.
      Our mission is to optimize your route using historical traffic accident data so you can avoid high-risk areas.
    </p>
    <Link 
      to="/map" 
      className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Generate Safe Route
    </Link>
  </div>
);

export default Home;
