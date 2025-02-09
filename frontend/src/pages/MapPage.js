import React, { useState } from "react";
import axios from "axios";

const MapPage = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [iframeSrc, setIframeSrc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Popular Durham locations for quick selection
  const popularLocations = [
    {
      name: "Duke University",
      address: "Durham, NC 27708",
    },
    {
      name: "Durham Bulls Athletic Park",
      address: "409 Blackwell St, Durham, NC 27701",
    },
    {
      name: "Streets at Southpoint",
      address: "6910 Fayetteville Rd, Durham, NC 27713",
    },
    {
      name: "Duke Gardens",
      address: "420 Anderson St, Durham, NC 27708",
    },
    {
      name: "Downtown Durham",
      address: "201 E Main St, Durham, NC 27701",
    },
  ];

  // Common Durham neighborhoods
  const durhamNeighborhoods = [
    "Trinity Park",
    "Duke Forest",
    "Hope Valley",
    "Northgate Park",
    "Walltown",
    "Old West Durham",
    "American Village",
    "Lakewood",
  ];

  const handleGenerateMap = async () => {
    try {
      setIsLoading(true);
      setIframeSrc("https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif");

      const response = await axios.post(
        "http://167.172.135.178:5000//generate-map",
        {
          start: start,
          end: end,
        }
      );

      if (response.status === 200) {
        setIframeSrc("http://167.172.135.178:5000/safe_route_map.html");
        const iframe = document.querySelector("iframe");
        if (iframe) {
          iframe.src = iframe.src;
        }
      }
    } catch (error) {
      console.error("Error generating map:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const QuickSelectButton = ({ location, onClick }) => (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-white/80 rounded-lg text-sm text-gray-700 hover:bg-blue-50 transition whitespace-nowrap"
    >
      {location.name}
    </button>
  );

  const handleRandomize = () => {
    const randomStart =
      popularLocations[Math.floor(Math.random() * popularLocations.length)];
    let randomEnd;
    do {
      randomEnd =
        popularLocations[Math.floor(Math.random() * popularLocations.length)];
    } while (randomEnd === randomStart);

    setStart(randomStart.address);
    setEnd(randomEnd.address);
  };

  const openGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(end)}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Plan Your Safe Journey
          </h1>

          {/* Quick Select Popular Locations */}
          <div className="max-w-4xl mx-auto mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Popular Destinations
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {popularLocations.map((location, index) => (
                <QuickSelectButton
                  key={index}
                  location={location}
                  onClick={() => setEnd(location.address)}
                />
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Starting Point
                </label>
                <input
                  type="text"
                  placeholder="Enter starting location"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  list="durham-locations"
                />
              </div>

              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  placeholder="Enter destination"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  list="durham-locations"
                />
              </div>
            </div>

            {/* HTML5 Datalist for address autocomplete */}
            <datalist id="durham-locations">
              {popularLocations.map((location, index) => (
                <option key={index} value={location.address}>
                  {location.name}
                </option>
              ))}
              {durhamNeighborhoods.map((neighborhood, index) => (
                <option
                  key={`n-${index}`}
                  value={`${neighborhood}, Durham, NC`}
                >
                  {neighborhood}
                </option>
              ))}
            </datalist>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleRandomize}
                className="px-6 py-3 bg-green-600 text-white rounded-full text-base font-medium hover:bg-green-700 transition transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🎲 Randomize Locations
              </button>
              <button
                onClick={handleGenerateMap}
                disabled={isLoading}
                className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Generating Safe Route..."
                  : "Take Me There Safely! 🚗"}
              </button>
            </div>
          </div>
        </div>

        {/* Map Display */}
        {iframeSrc && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3">
                <h3 className="text-white text-lg font-semibold text-center">
                  SafeRoute Path
                  <span className="text-sm font-normal ml-2 opacity-90">
                    (Optimized for Safety)
                  </span>
                </h3>
              </div>
              <div className="aspect-square">
                {iframeSrc.includes("loading-gif.gif") ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                      <img
                        src={iframeSrc}
                        className="w-16 h-16 mx-auto"
                        alt="Loading..."
                      />
                      <p className="mt-4 text-gray-600">
                        Calculating the safest route for you...
                      </p>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={iframeSrc}
                    className="w-full h-full border-none"
                    title="Safe Route Map"
                  />
                )}
              </div>
            </div>

            {/* Compare Link */}
            {!isLoading && (
              <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
                <div className="text-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Want to see the difference?
                  </h3>
                  <p className="text-gray-600">
                    Compare our safety-optimized route with Google Maps'
                    time-optimized route
                  </p>
                </div>
                <button
                  onClick={openGoogleMaps}
                  className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-full text-lg font-semibold transition transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span>Compare with Google Maps</span>
                  <span className="bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform">
                    ↗️
                  </span>
                </button>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Our route: Prioritizes your safety
                  <span className="mx-2">•</span>
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Google route: Fastest path
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
