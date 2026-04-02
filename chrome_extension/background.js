// Background Service Worker

const DEFAULT_SERVER = 'http://127.0.0.1:5000';

// Handle extension icon click - toggle sidebar
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'parse') {
    handleParse(msg, sendResponse);
    return true; // async response
  }
  
  if (msg.action === 'openSettings') {
    chrome.runtime.openOptionsPage();
  }
});

async function handleParse(msg, sendResponse) {
  try {
    // Get server URL from storage
    const data = await chrome.storage.sync.get(['serverUrl']);
    const serverUrl = data.serverUrl || DEFAULT_SERVER;
    
    console.log('Sending request to:', serverUrl);
    
    const payload = { ...msg };
    delete payload.action;

    const response = await fetch(`${serverUrl}/parse`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    
    const jsonResponse = await response.json();
    console.log('Server response:', JSON.stringify(jsonResponse, null, 2));
    
    // The server returns { result: { query, instructions } }
    // Pass the inner result directly
    if (jsonResponse.result) {
      sendResponse({ result: jsonResponse.result });
    } else {
      sendResponse({ result: jsonResponse });
    }
  } catch (err) {
    console.error('Parse error:', err);
    sendResponse({ error: err.message });
  }
}
