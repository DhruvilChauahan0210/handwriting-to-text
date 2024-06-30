const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
let drawing = false;
let lastX = 0;
let lastY = 0;

let urlPostfix = "handwriting-to-text-google";

function handleClick(element) {
  urlPostfix = element.value;
}

canvas.addEventListener("mousedown", (event) => {
  drawing = true;
  [lastX, lastY] = [event.offsetX, event.offsetY];
});

canvas.addEventListener("mouseup", () => (drawing = false));
canvas.addEventListener("mouseout", () => (drawing = false));

canvas.addEventListener("mousemove", (event) => draw(event));

// Support touch events for mobile devices
canvas.addEventListener("touchstart", (event) => {
  drawing = true;
  const touch = event.touches[0];
  const rect = canvas.getBoundingClientRect();
  [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
});

canvas.addEventListener("touchend", () => (drawing = false));
canvas.addEventListener("touchcancel", () => (drawing = false));

canvas.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  const rect = canvas.getBoundingClientRect();
  draw({
    offsetX: touch.clientX - rect.left,
    offsetY: touch.clientY - rect.top,
  });
});

function draw(event) {
  if (!drawing) return;

  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000000";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();

  [lastX, lastY] = [event.offsetX, event.offsetY];
}

document.getElementById("clearButton").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("convertButton").addEventListener("click", async () => {
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "Converting...";

  const image = canvas.toDataURL("image/png").split(",")[1];

  try {
    let startTime = new Date();
    const response = await fetch(`http://localhost:3000/${urlPostfix}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({image}),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    let endTime = new Date();
    let timeDiff = endTime - startTime;
    timeDiff /= 1000;

    resultDiv.textContent =
      (data.text || "No text detected.") + "\n"+"response time: " + timeDiff;
  } catch (error) {
    console.error("Error:", error);
    resultDiv.textContent = "Error converting handwriting to text.";
  }
});
