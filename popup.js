document.addEventListener('DOMContentLoaded', function() {
    let imagesData = [];
  
    // Fetch the images when the popup is first loaded.
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript(
        {
          target: {tabId: tabs[0].id},
          function: getImageData
        },
        (injectionResults) => {
          imagesData = injectionResults[0].result;
          populateTable(imagesData);
        }
      );
    });

    // Event listener for the Tiny button
    document.getElementById('tinyImagesBtn').addEventListener('click', function() {
      const tinyImages = imagesData.filter(data => data.width <= 100);
      populateTable(tinyImages);
    });
    
    // Event listener for the Small button
    document.getElementById('smallImagesBtn').addEventListener('click', function() {
      const smallImages = imagesData.filter(data => data.width <= 400);
      populateTable(smallImages);
    });

    // Event listener for the Large button
    document.getElementById('largeImagesBtn').addEventListener('click', function() {
      const largeImages = imagesData.filter(data => data.width >= 600);
      populateTable(largeImages);
    });
  
    // Event listener for the Reset button
    document.getElementById('resetImagesBtn').addEventListener('click', function() {
      populateTable(imagesData); // Repopulate the table with all images
    });
  });
  
  // Event listener for the Download All button
  document.getElementById('downloadAllBtn').addEventListener('click', function() {
    // Only download images that are currently filtered and displayed
    const imagesToDownload = document.querySelectorAll('#imagesTable tbody img');
    imagesToDownload.forEach(img => {
      chrome.downloads.download({ url: img.src });
    });
  });

  // Function to get image data from the current page
  function getImageData() {
    const images = document.querySelectorAll('img');
    return Array.from(images).map(img => ({
      src: img.src,
      width: img.naturalWidth,
      height: img.naturalHeight
    }));
  }
  
  // Function to populate the table with image data
  function populateTable(images) {
    const tableBody = document.querySelector('#imagesTable tbody');
    tableBody.innerHTML = ''; // Clear the table first
  
    images.forEach(data => {
      let row = tableBody.insertRow();
     
      // Cell for the image link
      let linkCell = row.insertCell(0);
      let a = document.createElement('a');
      a.href = data.src;
      a.textContent = data.src;
      a.target = '_blank'; // Open links in a new tab

      // Thumbnail and dimensions
      let thumbnail = document.createElement('span');
      thumbnail.className = 'thumbnail';
      thumbnail.innerHTML = `
        <img src="${data.src}" alt="Thumbnail" style="max-width:100px; max-height:100px;">
        <div class="dimensions">Dimensions: ${data.width} x ${data.height}</div>
      `;

      linkCell.appendChild(a);
      linkCell.appendChild(thumbnail);

      // Cell for the Download button
      let downloadCell = row.insertCell(1);
      let downloadButton = document.createElement('button');
      downloadButton.textContent = 'Download';
      downloadButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent navigation
        chrome.downloads.download({ url: data.src }); // Download the image
      });
      downloadCell.appendChild(downloadButton);
  });
}
  