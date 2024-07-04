import React, { useEffect } from 'react';
import './text.css';

const HandwritingToText = () => {
  let urlPostfix = 'handwriting-to-text-google';
  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    let urlPostfix = 'handwriting-to-text-google';

    

    const draw = (event) => {
      if (!drawing) return;

      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000000';

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();

      [lastX, lastY] = [event.offsetX, event.offsetY];
    };

    canvas.addEventListener('mousedown', (event) => {
      drawing = true;
      [lastX, lastY] = [event.offsetX, event.offsetY];
    });

    canvas.addEventListener('mouseup', () => (drawing = false));
    canvas.addEventListener('mouseout', () => (drawing = false));

    canvas.addEventListener('mousemove', (event) => draw(event));

    // Support touch events for mobile devices
    canvas.addEventListener('touchstart', (event) => {
      drawing = true;
      const touch = event.touches[0];
      const rect = canvas.getBoundingClientRect();
      [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
    });

    canvas.addEventListener('touchend', () => (drawing = false));
    canvas.addEventListener('touchcancel', () => (drawing = false));

    canvas.addEventListener('touchmove', (event) => {
      const touch = event.touches[0];
      const rect = canvas.getBoundingClientRect();
      draw({
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      });
    });

    document.getElementById('clearButton').addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('convertButton').addEventListener('click', async () => {
      const resultDiv = document.getElementById('result');
      resultDiv.textContent = 'Converting...';

      const image = canvas.toDataURL('image/png').split(',')[1];

      try {
        let startTime = new Date();
        const response = await fetch(`http://localhost:3000/${urlPostfix}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        let endTime = new Date();
        let timeDiff = endTime - startTime;
        timeDiff /= 1000;

        resultDiv.textContent = (data.text || 'No text detected.') + '\n' + 'response time: ' + timeDiff;
      } catch (error) {
        console.error('Error:', error);
        resultDiv.textContent = 'Error converting handwriting to text.';
      }
    });
  }, []);
  const handleClick = (service) => {
    urlPostfix = service;
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
