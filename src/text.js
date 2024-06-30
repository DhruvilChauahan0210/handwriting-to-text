import React, { useEffect } from 'react';
import './styles.css';
import './script'

const HandwritingToText = () => {
  useEffect(() => {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      const context = canvas.getContext('2d');
      // Ensure canvas drawing logic is performed here
    }
  }, []); // Empty dependency array ensures this runs once after component mounts

  const handleClick = (service) => {
    // Handle service selection
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navdiv">
          <div className="logo">
            <a href="#">
              <h1>Handwriting to Text</h1>
            </a>
          </div>
          <ul>
            <a href="#">
              <button id="text">Text</button>
            </a>
            <a href="#">
              <button id="upload">Upload</button>
            </a>
          </ul>
        </div>
      </nav>
      <canvas id="canvas" height="652px" width="1940px"></canvas>
      <div className="main2"></div>
      <div className="buttons">
        <button id="clearButton">Clear Canvas</button>
        <button id="convertButton">Convert to Text</button>
      </div>
      <div id="radio-selection">
        <input
          id="google"
          type="radio"
          name="service"
          onClick={() => handleClick('handwriting-to-text-google')}
          value="handwriting-to-text-google"
          defaultChecked
        />
        <label htmlFor="google">Google</label>
        <input
          id="azure"
          type="radio"
          name="service"
          onClick={() => handleClick('handwriting-to-text-azure')}
          value="handwriting-to-text-azure"
        />
        <label htmlFor="azure">Azure</label>
      </div>
      <div id="result"></div>
    </div>
  );
};

export default HandwritingToText;
