import React, { useState } from 'react';
import './upload.css'; // Import your CSS file here

function Upload() {
  const [urlPostfix, setUrlPostfix] = useState("handwriting-to-text-google");
  const [fileName, setFileName] = useState("");
  const [resultText, setResultText] = useState("");
  const [responseTime, setResponseTime] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleClick = (event) => {
    setUrlPostfix(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      const imagePreview = document.getElementById("imagePreview");
      imagePreview.src = URL.createObjectURL(file);
      imagePreview.style.display = "block";
      document.getElementById("drop-area").style.display = "none";
    } else {
      setSelectedFile(null);
      setFileName("");
      const imagePreview = document.getElementById("imagePreview");
      imagePreview.src = "";
      imagePreview.style.display = "none";
      document.getElementById("drop-area").style.display = "block";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file first.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1];

      try {
        let startTime = new Date();
        const response = await fetch(`http://localhost:3000/${urlPostfix}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64Image }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        let endTime = new Date();
        let timeDiff = (endTime - startTime) / 1000;

        setResultText((data.text || "No text detected.") + "\nResponse time: " + timeDiff + " seconds");
        setResponseTime(timeDiff);
      } catch (error) {
        console.error("Error:", error);
        setResultText("Error converting handwriting to text.");
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    const dropArea = document.getElementById("drop-area");
    dropArea.classList.add("dragover");
  };

  const handleDragLeave = () => {
    const dropArea = document.getElementById("drop-area");
    dropArea.classList.remove("dragover");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const dropArea = document.getElementById("drop-area");
    dropArea.classList.remove("dragover");

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const fileInput = document.getElementById("imageInput");
      fileInput.files = files;
      handleFileChange({ target: fileInput });
    }
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

      <label htmlFor="imageInput" id="drop-area" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <input type="file" id="imageInput" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      </label>

      <img id="imagePreview" src="" alt="Image Preview" style={{ display: 'none' }} />
      <div className="buttons">
        <button id="uploadButton" onClick={handleUpload}>Upload and Convert</button>
        <div id="fileNameDisplay">{fileName && `Selected file: ${fileName}`}</div>
      </div>

      <div id="radio-selection">
        <input id="google" type="radio" name="service" onChange={handleClick} value="handwriting-to-text-google" checked={urlPostfix === 'handwriting-to-text-google'} />
        <label htmlFor="google">Google</label>
        <input id="azure" type="radio" name="service" onChange={handleClick} value="handwriting-to-text-azure" checked={urlPostfix === 'handwriting-to-text-azure'} />
        <label htmlFor="azure">Azure</label>
      </div>

      <div id="result">{resultText && `${resultText}\nResponse time: ${responseTime} seconds`}</div>
    </div>
  );
}

export default Upload;
