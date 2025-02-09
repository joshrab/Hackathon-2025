// frontend/src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav className="bg-blue-600 p-4 shadow">
    <div className="container mx-auto flex justify-between items-center">
      <div className="text-white text-2xl font-bold">
        SafeRoute
      </div>
      <div className="space-x-4">
        <Link to="/" className="text-white hover:text-gray-200">Home</Link>
        <Link to="/map" className="text-white hover:text-gray-200">Route</Link>
        <Link to="/about" className="text-white hover:text-gray-200">About</Link>
      </div>
    </div>
  </nav>
);

export default NavBar;
