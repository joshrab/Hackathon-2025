import React, { useState } from "react";
import axios from "axios";

const MapComponent = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleGenerateMap = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/generate-map", {
        start: start,
        end: end,
      });
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error generating map:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Start"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <input
        type="text"
        placeholder="Destination"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />
      <button onClick={handleGenerateMap}>Generate Map</button>

      <iframe
        src="http://127.0.0.1:5500/data/safe_route_map.html"
        // src="http://167.172.135.178:5500/data/safe_route_map.html"
        width="100%"
        height="500px"
        title="Map"
      ></iframe>
    </div>
  );
};

export default MapComponent;
