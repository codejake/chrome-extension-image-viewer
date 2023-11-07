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
  
    // Add click event listener to the Large button
    document.getElementById('largeImagesBtn').addEventListener('click', function() {
      const largeImages = imagesData.filter(data => data.width >= 600);
      populateTable(largeImages);
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
      let cell = row.insertCell(0);
      let a = document.createElement('a');
      a.href = data.src;
      a.textContent = data.src;
      a.target = '_blank'; // Open links in a new tab
  
      let thumbnail = document.createElement('span');
      thumbnail.className = 'thumbnail';
      thumbnail.innerHTML = `
        <img src="${data.src}" alt="Thumbnail">
        <div class="dimensions">Dimensions: ${data.width} x ${data.height}</div>
      `;
  
      cell.appendChild(a);
      cell.appendChild(thumbnail);
    });
  }
  