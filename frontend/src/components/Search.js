import React, { useState } from "react";
import axios from "axios";

const Search = () => {
  const [start, setStart] = useState("202 Watts St, Durham");
  const [end, setEnd] = useState("1007 Taylor St, Durham");
  const [iframeSrc, setIframeSrc] = useState("");

  const handleGenerateMap = async () => {
    try {
      setIframeSrc("https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif");
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
    <div className="bg-green-200 flex flex-col justify-center min-h-screen w-full">
      <div className="text-center w-full">
        <h1 className="text-6xl mb-4">SafeRoute</h1>
        <div className="space-x-2">
          <input
            type="text"
            placeholder="Start"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="mb-2 p-2 border border-gray-400"
          />
          <input
            type="text"
            placeholder="Destination"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="mb-2 p-2 border border-gray-400"
          />
          <button
            onClick={handleGenerateMap}
            className="mb-4 p-2 bg-blue-500 text-white"
          >
            Take Me There Safely!
          </button>
        </div>
        {iframeSrc && (
          <div className="flex justify-center w-full">
            {iframeSrc.includes("loading-gif.gif") ? (
              <img src={iframeSrc} className="w-16 h-16" alt="Loading..." />
            ) : (
              <iframe
                src={iframeSrc}
                className="w-full max-w-3xl"
                style={{ height: "calc(100vh - 200px)" }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
