let urlPostfix = "handwriting-to-text-google";

function handleClick(element) {
    urlPostfix = element.value;
}


document.getElementById("uploadButton").addEventListener("click", async () => {
    const fileInput = document.getElementById("imageInput");
    const resultDiv = document.getElementById("result");

    if (fileInput.files.length === 0) {
        alert("Please select an image file first.");
        return;
    }

    const file = fileInput.files[0];
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

            resultDiv.textContent =
                (data.text || "No text detected.") + "\nResponse time: " + timeDiff + " seconds";
        } catch (error) {
            console.error("Error:", error);
            resultDiv.textContent = "Error converting handwriting to text.";
        }
    };

    reader.readAsDataURL(file);
});

document.getElementById("imageInput").addEventListener("change", function () {
    const fileInput = this;
    const fileNameDisplay = document.getElementById("fileNameDisplay");
    const imagePreview = document.getElementById("imagePreview");
    const dropArea = document.getElementById("drop-area");

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileNameDisplay.textContent = `Selected file: ${file.name}`;
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = "block";
        dropArea.style.display = "none"; // Hide the drop-area
    } else {
        fileNameDisplay.textContent = "";
        imagePreview.src = "";
        imagePreview.style.display = "none";
        dropArea.style.display = "block"; // Show the drop-area if no file is selected
    }
});

const dropArea = document.getElementById("drop-area");

dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("dragover");

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const fileInput = document.getElementById("imageInput");
        fileInput.files = files;
        fileInput.dispatchEvent(new Event("change"));
    }
});
