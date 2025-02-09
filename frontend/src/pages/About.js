import React, { useState } from "react";

function AboutPage() {
  const [darkMode, setDarkMode] = useState(false);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: darkMode ? "linear-gradient(135deg, #2F4F4F, #556B2F)" : "linear-gradient(135deg, #8FBC8F, #2F4F4F)",
    color: darkMode ? "#f0f0f0" : "#1a202c", // Light text for dark mode, dark text for light mode
    padding: "2rem",
    fontFamily: "'Roboto', sans-serif",
    transition: "background 0.5s ease, color 0.5s ease",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
    color: darkMode ? "#8FBC8F" : "#2F4F4F", // Adjust heading color for dark mode
    textAlign: "center",
    transition: "color 0.5s ease",
  };

  const textStyle = {
    fontSize: "1.2rem",
    color: darkMode ? "#dcdcdc" : "#000000", // Lighter color for body text in dark mode
    textAlign: "center",
    maxWidth: "45rem",
    lineHeight: "1.6",
    marginBottom: "2rem",
    transition: "color 0.5s ease",
  };

  const buttonStyle = {
    marginTop: "1.5rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#556B2F",
    color: "#fff",
    fontWeight: "600",
    borderRadius: "0.5rem",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
    textDecoration: "none",
    transition: "background-color 0.3s ease, transform 0.2s, opacity 0.3s",
    textAlign: "center",
    fontSize: "1.125rem",
  };

  const buttonHoverStyle = {
    backgroundColor: "#6B8E23",
    transform: "scale(1.05)",
    opacity: "0.8", // Slight fade on hover
  };

  const darkModeToggleStyle = {
    position: "absolute",
    top: "1.5rem",
    right: "1.5rem",
    padding: "0.5rem",
    backgroundColor: darkMode ? "#8FBC8F" : "#2F4F4F",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const handleToggle = () => setDarkMode(!darkMode);

  return (
    <div style={containerStyle}>
      <button onClick={handleToggle} style={darkModeToggleStyle}>
        {darkMode ? "🌙" : "☀️"}
      </button>
      <h1 style={headingStyle}>About SafeRoute</h1>
      <p style={textStyle}>
        SafeRoute is a destination routing application designed to prioritize user safety above all else. By incorporating local
        traffic and accident data dating back to 2016, SafeRoute is able to generate directions avoiding historically dangerous areas.
      </p>
      <div>
        <a
          href="/"
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
            e.target.style.transform = buttonHoverStyle.transform;
            e.target.style.opacity = buttonHoverStyle.opacity;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = buttonStyle.backgroundColor;
            e.target.style.transform = "none";
            e.target.style.opacity = "1";
          }}
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default AboutPage;