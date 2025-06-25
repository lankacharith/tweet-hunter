// Popup script for Tweet Hunter extension
document.addEventListener('DOMContentLoaded', function() {
  const statusElement = document.getElementById('status');
  const statusText = statusElement.querySelector('.status-text');
  const statusDesc = statusElement.querySelector('.status-desc');

  // Check if we're on a supported page
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    const url = currentTab.url;
    
    if (isSupportedPage(url)) {
      statusElement.className = 'status active';
      statusText.textContent = 'Active';
      statusDesc.textContent = 'Tweet Hunter is running on this page';
    } else {
      statusElement.className = 'status inactive';
      statusText.textContent = 'Inactive';
      statusDesc.textContent = 'Navigate to an X (Twitter) profile page to activate';
    }
  });
});

function isSupportedPage(url) {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;
    
    // Check if it's x.com or twitter.com
    if (hostname !== 'x.com' && hostname !== 'twitter.com') {
      return false;
    }
    
    // Check if it's a profile page (single username in path)
    const pathParts = pathname.split('/').filter(part => part.length > 0);
    return pathParts.length === 1;
    
  } catch (error) {
    return false;
  }
} 