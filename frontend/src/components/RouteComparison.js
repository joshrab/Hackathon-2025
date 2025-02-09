import React from 'react';

const RouteComparison = () => {
  return (
    <div className="py-16 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Why Choose SafeRoute?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-red-600">
              Traditional Path
              <span className="text-gray-600 text-base font-normal ml-2">
                (Time Optimized)
              </span>
            </h3>
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img 
                src="GoogleRouteImage1.png" 
                alt="Traditional route map"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                10 min
              </div>
              <div className="absolute bottom-2 left-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                Passes through high-risk areas
              </div>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Crosses intersections with 58 and 158 reported accidents
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Routes through areas with high risk
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-600">
              SafeRoute Path
              <span className="text-gray-600 text-base font-normal ml-2">
                (Safety Optimized)
              </span>
            </h3>
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img 
                src="SafeRouteImage1.png" 
                alt="SafeRoute map"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                13 min
              </div>
              <div className="absolute bottom-2 left-2 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                Avoids accident hotspots
              </div>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Reroutes around dangerous intersections
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Uses streets with fewer historical accidents
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-gray-600 mb-6">
            While traditional navigation apps focus solely on speed, SafeRoute analyzes 
            historical accident data to provide routes that balance safety with efficiency. 
            Our routes may take a few minutes longer, but they significantly reduce your 
            exposure to high-risk areas.
          </p>
          <div className="inline-flex items-center justify-center space-x-2 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="ml-2 text-gray-600">High-risk areas (50+ accidents)</span>
            </div>
            <span className="text-gray-400">|</span>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="ml-2 text-gray-600">SafeRoute path</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteComparison;