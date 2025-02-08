import React, { useState } from "react";
import axios from "axios";

const MapComponent = () => {
  const [startLat, setStartLat] = useState("");
  const [startLon, setStartLon] = useState("");
  const [endLat, setEndLat] = useState("");
  const [endLon, setEndLon] = useState("");

  const handleGenerateMap = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/generate-map", {
        start_lat: parseFloat(startLat),
        start_lon: parseFloat(startLon),
        end_lat: parseFloat(endLat),
        end_lon: parseFloat(endLon),
      });
    } catch (error) {
      console.error("Error generating map:", error);
    }
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Start Latitude"
        value={startLat}
        onChange={(e) => setStartLat(e.target.value)}
      />
      <input
        type="number"
        placeholder="Start Longitude"
        value={startLon}
        onChange={(e) => setStartLon(e.target.value)}
      />
      <input
        type="number"
        placeholder="End Latitude"
        value={endLat}
        onChange={(e) => setEndLat(e.target.value)}
      />
      <input
        type="number"
        placeholder="End Longitude"
        value={endLon}
        onChange={(e) => setEndLon(e.target.value)}
      />
      <button onClick={handleGenerateMap}>Generate Map</button>

      <iframe
        src="http://127.0.0.1:5500/data/safe_route_map.html"
        width="100%"
        height="500px"
        title="Map"
      ></iframe>
    </div>
  );
};

export default MapComponent;
