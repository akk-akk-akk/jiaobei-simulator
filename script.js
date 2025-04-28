function initHamburgerMenu() {
  /* initialise Hamburger-Menu */
  const hamburger = document.querySelector(".main__nav-ham");
  const navMenu = document.querySelector(".main__nav-list");
  const title = document.querySelector(".main__nav-title");

  hamburger.addEventListener("click", mobileMenu);

  function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  }

  function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
}

initHamburgerMenu();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio || 1;
canvas.width = 1000 * dpr;
canvas.height = 1000 * dpr;
ctx.scale(dpr, dpr);
ctx.imageSmoothingEnabled = false;

const probSlider = document.getElementById("probSlider");
const probLabel = document.getElementById("probLabel");
const imageLabel = document.getElementById("imageLabel");
const textLabel = document.getElementById("textLabel");

const imageOptions = [1, 3, 5, 7];
const textOptions = ["a", "b", "c"];
const imgLabels = ["Jiaobei", "Coin", "B/W", "1/0"];
const textLabels = ["Divine", "Ambiguous", "Secular"];

let probabilityValue = 0.5;
let imageAbstractionLevel = 0;
let textAbstractionLevel = 0;
let pictureList = [];
let scaleFactor = 1.2; // Add scaleFactor variable



function loadImages(baseIndex, callback) {
  let loaded = 0;
  pictureList = [new Image(), new Image()];
  for (let i = 0; i < 2; i++) {
    pictureList[i].src = `${baseIndex + i}.png`;
    pictureList[i].onload = () => {
      loaded++;
      if (loaded === 2) callback();
    };
  }
}


function drawImages() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let count1 = 0;
  let count2 = 0;
  let messages = [
    ["The gods are laughing, try again.", "The gods are displeased...", "The gods agree."],
    ["Signs point to yes.", "My sources say no.", "Concentrate and try again."],
    ["Yes.", "No.", "Maybe."]
  ];

  // Define the minimum y-coordinate to ensure images are below the text
  const minY = 150 * scaleFactor; // Adjust this value based on the height of the text

  for (let i = 0; i < 2; i++) {
    const r = Math.random();
    const chosen = r < probabilityValue ? 0 : 1;
    const image = pictureList[chosen];

    if (chosen === 0) count1++;
    else count2++;

    const w = 250 * scaleFactor; // Scale the width
    const h = (image.height / image.width) * w; // Maintain aspect ratio

    // Calculate random positions
    let x = Math.random() * (canvas.width / dpr - w - 50 * scaleFactor) + 25 * scaleFactor;
    let y = Math.random() * (canvas.height / dpr - h - 50 * scaleFactor) + minY;

    // Clamp positions to ensure they stay within the canvas
    x = Math.max(0, Math.min(x, canvas.width / dpr - w));
    y = Math.max(minY, Math.min(y, canvas.height / dpr - h));

    ctx.drawImage(image, x, y, w, h);

    // Blue rectangle border
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2 * scaleFactor; // Scale the border thickness
    ctx.strokeRect(x, y, w, h);

    // Blue background for r probability text
    ctx.fillStyle = "blue";
    ctx.fillRect(x - 1, y - 20 * scaleFactor, 125 * scaleFactor, 20 * scaleFactor); // Background for "r = ..."
    ctx.fillRect(x - 1, y + h, 200 * scaleFactor, 20 * scaleFactor); // Background for "Chosen: Image ..."

    // Text
    ctx.fillStyle = "white";
    ctx.font = `${16 * scaleFactor}px ABC Diatype Mono`; // Scale the font size
    ctx.textAlign = "left"; // Align text to the left
    ctx.fillText("r = " + r.toFixed(2), x + 2 * scaleFactor, y - 5 * scaleFactor); // Add padding of 5px
    ctx.fillText("Image: " + imgLabels[imageAbstractionLevel], x + 5 * scaleFactor, y + h + 15 * scaleFactor); // Add padding of 5px
  }

  let msg;
  if (count1 === 2) msg = messages[textAbstractionLevel][0];
  else if (count2 === 2) msg = messages[textAbstractionLevel][1];
  else msg = messages[textAbstractionLevel][2];

  // Measure the width of the main text
  ctx.font = `${28 * scaleFactor}px myfont`; // Scale the font size
  const textWidth = ctx.measureText(msg).width + 50 * scaleFactor;
  const textHeight = 50 * scaleFactor; // Fixed height for the rectangle
  const textX = Math.max(0, Math.min((canvas.width / (2 * dpr)) - (textWidth / 2), canvas.width / dpr - textWidth)); // Clamp the x position
  const textY = 60 * scaleFactor; // Position at the top

  // Blue rectangle border for the main text
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2 * scaleFactor; // Scale the border thickness
  ctx.strokeRect(textX, textY - 2.5 * scaleFactor, textWidth, textHeight);

  // Draw the main text
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(msg, canvas.width / (2 * dpr), textY + 30 * scaleFactor);

  // Measure the width of the label text
  const labels = ["Divine", "Ambiguous", "Secular"];
  const labelText = "Language: " + labels[textAbstractionLevel];
  const labelWidth = ctx.measureText(labelText).width - 75 * scaleFactor; // Add padding for the rectangle
  const labelX = Math.max(0, Math.min(textX, canvas.width / dpr - labelWidth)); // Clamp the x position
  const labelY = textY + textHeight + 5 * scaleFactor;

  // Blue rectangle border for the label
  ctx.fillStyle = "blue";
  ctx.fillRect(labelX - 1, labelY - 7.5 * scaleFactor, labelWidth, 20 * scaleFactor);

  // Draw the label text
  ctx.fillStyle = "white";
  ctx.font = `${16 * scaleFactor}px ABC Diatype Mono`; // Scale the font size
  ctx.textAlign = "left"; // Align text to the left
  ctx.fillText(labelText, labelX + 5 * scaleFactor, labelY + 7.5 * scaleFactor); // Add padding of 5px
}



probSlider.addEventListener("input", () => {
  probabilityValue = parseFloat(probSlider.value);
  probLabel.textContent = `1. Probability Threshold: ${Math.round(probabilityValue * 100)}%`;
  drawImages();
});

function createOptions(containerId, options, callback, labelUpdate, labels) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Clear existing options

  options.forEach((val, i) => {
    const wrapper = document.createElement("div");
    wrapper.style.textAlign = "center"; // Center the content

    const img = document.createElement("img");
    img.src = `${val}.png`;
    img.alt = labels[i]; // Add alt text for accessibility
    img.classList.add("option-button"); // Add a common class for styling

    img.addEventListener("click", () => {
      // Remove the red glow from all buttons
      const buttons = container.querySelectorAll(".option-button");
      buttons.forEach((button) => button.classList.remove("selected"));

      // Add the red glow to the clicked button
      img.classList.add("selected");

      // Update the abstraction level and redraw
      callback(i);
      labelUpdate(i);
      drawImages();
    });

    const label = document.createElement("span");
    label.textContent = labels[i]; // Use the provided label
    label.style.display = "block"; // Ensure it appears below the image
    label.style.marginTop = "5px"; // Add spacing above the label

    wrapper.appendChild(img);
    wrapper.appendChild(label); // Append the label below the image
    container.appendChild(wrapper);
  });
}

// Update calls to createOptions
createOptions("imageOptions", imageOptions, (i) => {
  imageAbstractionLevel = i;
  loadImages(1 + i * 2, drawImages);
}, (i) => {
  imageLabel.textContent = `2. Image Abstraction: ${imgLabels[i]}`;
}, imgLabels);

createOptions("textOptions", textOptions, (i) => {
  textAbstractionLevel = i;
}, (i) => {
  textLabel.textContent = `3. Text Abstraction: ${textLabels[i]}`;
}, textLabels);

loadImages(1, drawImages);

// Add an event listener to the canvas for the click event
canvas.addEventListener("click", () => {
  drawImages(); // Regenerate the images when the canvas is clicked
});

document.querySelectorAll(".touch-icon").forEach((icon) => {
  icon.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent the event from bubbling up to other elements

    const tooltipText = icon.getAttribute("data-tooltip");

    // Create the tooltip pop-up
    const tooltipPopup = document.createElement("div");
    tooltipPopup.classList.add("tooltip-popup");
    tooltipPopup.innerHTML = `
      <span class="close-btn">&times;</span>
      <p>${tooltipText}</p>
    `;

    // Append the tooltip to the body
    document.body.appendChild(tooltipPopup);

    // Show the tooltip
    tooltipPopup.classList.add("show");

    // Add event listener to close the tooltip
    tooltipPopup.querySelector(".close-btn").addEventListener("click", () => {
      tooltipPopup.remove();
    });
  });
});

let lastTouchEnd = 0;

document.addEventListener("touchend", (event) => {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault(); // Prevent double-tap zoom
  }
  lastTouchEnd = now;
});

