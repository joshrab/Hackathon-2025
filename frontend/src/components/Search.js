import React, { useState } from "react";
import axios from "axios";

const Search = () => {
  const [start, setStart] = useState("202 Watts St, Durham");
  const [end, setEnd] = useState("1007 Taylor St, Durham");
  const [iframeSrc, setIframeSrc] = useState("");

  const handleGenerateMap = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/generate-map", {
        start: start,
        end: end,
      });
      if (response.status === 200) {
        setIframeSrc("http://127.0.0.1:5500/data/safe_route_map.html");
        const iframe = document.querySelector("iframe");
        // Refresh iframe
        if (iframe) {
          iframe.src = iframe.src;
        }
      }
    } catch (error) {
      console.error("Error generating map:", error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "lightgreen",
        padding: "20px",
        height: "100vh",
      }}
    >
      <h1>Search Page</h1>
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
      {iframeSrc && <iframe src={iframeSrc} width="100%" height="600px" />}
    </div>
  );
};

export default Search;
