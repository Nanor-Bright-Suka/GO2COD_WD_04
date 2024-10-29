// Select all images in the gallery
const images = document.querySelectorAll("#gallery img");

// Add click event listener to each image
images.forEach(image => {
  image.addEventListener("click", () => {
    // Open a new window with the image's `src` as the URL
    const imageUrl = image.src;

    // Create a new image object to get its dimensions
    const img = new Image();
    img.src = imageUrl;

    // Wait for the image to load to get its natural dimensions
    img.onload = () => {
      // Calculate the aspect ratio
      const aspectRatio = img.naturalWidth / img.naturalHeight;

      // Determine window dimensions based on the screen size
      let width, height;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      if (screenWidth < 640) { 
        width = screenWidth * 0.95; 
        height = width / aspectRatio; 
      } else if (screenWidth >= 640 && screenWidth < 1024) { 
        width = screenWidth * 0.85;
        height = width / aspectRatio; 
      } else { 
        width = screenWidth * 0.75; 
        height = width / aspectRatio; 
      }

      // Adjust height if it exceeds screen height
      if (height > screenHeight * 0.95) {
        height = screenHeight * 0.95; 
        width = height * aspectRatio; 
      }

      // Set the new window to display the full image
      const newWindow = window.open("", "_blank", `width=${Math.round(width)},height=${Math.round(height)}`);
      newWindow.document.write(`
        <html>
          <head>
            <title>Full-Size Image</title>
            <style>
              /* Center and scale the image to fit the window */
              body, html { margin: 0; height: 100%; display: flex; justify-content: center; align-items: center; background-color: black; }
              img { max-width: 100%; max-height: 100%; }
            </style>
          </head>
          <body>
            <img src="${imageUrl}" alt="Full-size image">
          </body>
        </html>
      `);
      newWindow.document.close(); // Closes the document stream, rendering it
    };
  });
});



//Downloading The Image
// Select all download buttons
const downloadButtons = document.querySelectorAll(".download-btn");

downloadButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    // Prevent any default action
    e.preventDefault();
    
    // Get the image URL from the data attribute
    const imageUrl = button.getAttribute("data-src");
    
    // Create an anchor element and set the download attributes
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = imageUrl.split('/').pop(); // Sets file name as the original image file name
    a.style.display = 'none';
    
    // Append the anchor, trigger click, and remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
});



//Displaying Gallery

const gallery = document.getElementById("gallery");
const imageWrappers = document.querySelectorAll("#gallery > div"); // Select image wrappers
const itemsPerPage = 10; // Number of images per page
let currentPage = 1; // Starting page

// Function to render images for the current page
function renderGallery(page) {
    const totalImages = imageWrappers.length; // Total number of images
    const totalPages = Math.ceil(totalImages / itemsPerPage); // Total pages

    // Determine indices for the current page's images
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalImages);

    // Render images for the current page
    imageWrappers.forEach((wrapper, index) => {
        wrapper.style.display = index >= startIndex && index < endIndex ? "block" : "none";
    });

    // Update visibility of the no images message and pagination controls
    updateVisibility(startIndex, totalImages);
    updatePageInfo(currentPage, totalPages);
}

// Function to update visibility of the no images message and pagination controls
function updateVisibility(startIndex, totalImages) {
    const noImagesMessage = document.getElementById("no-images-message");
    const paginationControls = document.getElementById("pagination-controls");

    if (startIndex >= totalImages) {
        noImagesMessage.style.display = "block";
        paginationControls.style.display = "none";
    } else {
        noImagesMessage.style.display = "none";
        paginationControls.style.display = "block";
    }
}

// Function to update page info
function updatePageInfo(current, total) {
    const pageInfo = document.getElementById("page-info");
    pageInfo.innerText = `Page ${current} of ${total}`;
}

// Event listener for the Next button
document.getElementById("next-btn").addEventListener("click", () => {
    const totalPages = Math.ceil(imageWrappers.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderGallery(currentPage);
    } else {
        alert("You are already on the last page.");
    }
});

// Event listener for the Previous button
document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderGallery(currentPage);
    } else {
        alert("You are already on the first page.");
    }
});

// Initial render
renderGallery(currentPage);
