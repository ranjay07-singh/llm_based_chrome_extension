// Settings page script
document.addEventListener('DOMContentLoaded', function() {
  const serverUrlInput = document.getElementById('serverUrl');
  const saveBtn = document.getElementById('saveBtn');
  const testBtn = document.getElementById('testBtn');
  const status = document.getElementById('status');
  
  // Load saved URL
  chrome.storage.sync.get(['serverUrl'], function(data) {
    if (data.serverUrl) {
      serverUrlInput.value = data.serverUrl;
    }
  });
  
  // Show status message
  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'show ' + type;
    if (type !== 'loading') {
      setTimeout(function() {
        status.className = '';
      }, 4000);
    }
  }
  
  // Save button click
  saveBtn.addEventListener('click', function() {
    const url = serverUrlInput.value.trim().replace(/\/$/, '');
    chrome.storage.sync.set({ serverUrl: url }, function() {
      showStatus('✅ Saved!', 'success');
    });
  });
  
  // Test button click
  testBtn.addEventListener('click', function() {
    const url = serverUrlInput.value.trim().replace(/\/$/, '');
    showStatus('⏳ Testing...', 'loading');
    
    fetch(url + '/health', {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    .then(function(response) {
      if (response.ok) {
        showStatus('✅ Connection successful!', 'success');
        // Also save the URL
        chrome.storage.sync.set({ serverUrl: url });
      } else {
        throw new Error('Server error: ' + response.status);
      }
    })
    .catch(function(err) {
      showStatus('❌ Failed: ' + err.message, 'error');
    });
  });
});
