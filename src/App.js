import React from 'react';
import './styles.css';
import './script.js'

function App() {
  const handleClick = (event) => {
    // Add your JavaScript logic here
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
      <script src="script.js"></script>
    </div>
  );
}

export default App;
