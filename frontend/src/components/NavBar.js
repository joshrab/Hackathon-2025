import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkBaseClasses = "px-4 py-2 rounded-full transition-all duration-300 font-medium";
  const linkStyles = (path) => {
    return `${linkBaseClasses} ${
      isActive(path)
        ? "bg-white text-blue-600 shadow-md"
        : "text-white hover:bg-white/20"
    }`;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-bold text-white mb-4 md:mb-0 hover:opacity-90 transition-opacity"
        >
          <span className="bg-white text-blue-600 px-3 py-1 rounded-lg mr-1">Safe</span>
          <span>Route</span>
        </Link>
        
        <div className="flex space-x-2">
          <Link to="/" className={linkStyles("/")}>
            Home
          </Link>
          <Link to="/map" className={linkStyles("/map")}>
            Route
          </Link>
          <Link to="/about" className={linkStyles("/about")}>
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;