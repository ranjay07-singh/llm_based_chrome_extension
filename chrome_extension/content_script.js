// Content Script - Uses Shadow DOM for complete style isolation on ALL websites

(function() {
  // Prevent multiple injections
  if (document.getElementById('instruction-structurer-root')) return;

  // Create root container with Shadow DOM
  const root = document.createElement('div');
  root.id = 'instruction-structurer-root';
  root.style.cssText = 'all: initial !important;';
  document.body.appendChild(root);

  // Attach Shadow DOM for complete isolation
  const shadow = root.attachShadow({ mode: 'open' });

  // Inject all styles inside Shadow DOM
  const styles = document.createElement('style');
  styles.textContent = `
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .is-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2147483646;
      transition: all 0.3s;
      border: none;
      color: #fff;
      font-size: 24px;
    }
    .is-fab:hover { transform: scale(1.1); box-shadow: 0 6px 25px rgba(0, 212, 255, 0.5); }
    .is-fab.hidden { display: none; }

    .is-sidebar {
      position: fixed;
      top: 0;
      right: -420px;
      width: 400px;
      height: 100vh;
      background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color: #e4e4e7;
      font-size: 14px;
      line-height: 1.5;
    }
    .is-sidebar.open { right: 0; }

    .is-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: linear-gradient(90deg, #0f3460 0%, #1a1a2e 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      min-height: 64px;
    }
    .is-header-left { display: flex; align-items: center; gap: 12px; }
    .is-logo {
      width: 32px; height: 32px;
      background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-weight: bold; font-size: 12px; color: #fff;
    }
    .is-title { font-size: 15px; font-weight: 600; color: #fff; letter-spacing: 0.5px; }
    .is-header-btns { display: flex; align-items: center; gap: 8px; }
    .is-btn-icon {
      width: 32px; height: 32px; border: none;
      background: rgba(255, 255, 255, 0.1); border-radius: 8px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; color: #fff; font-size: 16px;
    }
    .is-btn-icon:hover { background: rgba(255, 255, 255, 0.2); }
    .is-btn-close:hover { background: rgba(239, 68, 68, 0.8); }

    .is-chat {
      flex: 1; overflow-y: auto; padding: 20px;
      display: flex; flex-direction: column; gap: 16px;
    }
    .is-chat::-webkit-scrollbar { width: 6px; }
    .is-chat::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
    .is-chat::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 3px; }

    .is-welcome { text-align: center; padding: 40px 20px; color: #a1a1aa; }
    .is-welcome-icon { font-size: 48px; margin-bottom: 16px; display: block; }
    .is-welcome-title { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 8px; display: block; }
    .is-welcome-text { font-size: 13px; line-height: 1.6; display: block; }

    .is-message {
      max-width: 85%; padding: 12px 16px; border-radius: 16px;
      animation: slideIn 0.3s ease;
      word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;
    }
    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .is-message.user {
      align-self: flex-end;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #fff; border-bottom-right-radius: 4px; max-width: 75%;
    }
    .is-message.assistant {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-bottom-left-radius: 4px; max-width: 95%;
    }
    .is-time { font-size: 10px; opacity: 0.7; margin-top: 6px; text-align: right; display: block; }

    .is-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px; padding: 12px 16px; margin: 8px 0;
      transition: all 0.2s;
    }
    .is-card:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(0, 212, 255, 0.3); }
    .is-card-num { font-size: 11px; color: #00d4ff; font-weight: 600; margin-bottom: 4px; display: block; }
    .is-card-text { font-size: 14px; color: #e4e4e7; line-height: 1.5; margin-bottom: 8px; display: block; word-wrap: break-word; overflow-wrap: break-word; }
    .is-type { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }
    /* 7 CLASSIFICATION CATEGORIES */
    .is-type-simple { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #fff; }           /* SIMPLE INSTRUCTION */
    .is-type-sequence { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #fff; }        /* INSTRUCTION WITH SEQUENCE */
    .is-type-parallel { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: #fff; }        /* PARALLEL INSTRUCTION */
    .is-type-purpose { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; }         /* INSTRUCTION WITH PURPOSE */
    .is-type-reason { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: #fff; }          /* INSTRUCTION WITH REASON */
    .is-type-exclusive-obj { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: #fff; }   /* EXCLUSIVE INSTRUCTION (OBJECTS) */
    .is-type-exclusive-act { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #fff; }   /* EXCLUSIVE INSTRUCTION (ACTIONS) */

    .is-loading { display: flex; align-items: center; gap: 8px; padding: 16px; color: #a1a1aa; }
    .is-dots { display: flex; gap: 4px; }
    .is-dot { width: 8px; height: 8px; background: #00d4ff; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
    .is-dot:nth-child(1) { animation-delay: -0.32s; }
    .is-dot:nth-child(2) { animation-delay: -0.16s; }
    .is-dot:nth-child(3) { animation-delay: 0s; }
    @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

    .is-input-area { padding: 16px 20px; background: rgba(0, 0, 0, 0.3); border-top: 1px solid rgba(255, 255, 255, 0.1); }
    .is-toggle-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 12px; color: #a1a1aa; }
    .is-toggle { position: relative; width: 36px; height: 20px; display: inline-block; }
    .is-toggle input { opacity: 0; width: 0; height: 0; }
    .is-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255, 255, 255, 0.2); border-radius: 20px; transition: 0.3s; }
    .is-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
    .is-toggle input:checked + .is-slider { background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%); }
    .is-toggle input:checked + .is-slider:before { transform: translateX(16px); }

    .is-input-row { display: flex; gap: 12px; align-items: flex-end; }
    .is-input {
      flex: 1; background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px;
      padding: 12px 16px; color: #fff; font-size: 14px;
      resize: none; min-height: 44px; max-height: 120px; outline: none;
      transition: all 0.2s; font-family: inherit; line-height: 1.4;
    }
    .is-input::placeholder { color: rgba(255, 255, 255, 0.4); }
    .is-input:focus { border-color: #00d4ff; background: rgba(255, 255, 255, 0.1); }

    .is-send {
      width: 44px; height: 44px; border: none;
      background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
      border-radius: 12px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; color: #fff; font-size: 18px; flex-shrink: 0;
    }
    .is-send:hover { transform: scale(1.05); box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4); }
    .is-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .is-error { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; padding: 12px 16px; border-radius: 12px; font-size: 13px; }
    .is-summary { background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 153, 204, 0.1) 100%); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
    .is-summary-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #00d4ff; margin-bottom: 8px; display: block; }
    .is-summary-text { font-size: 14px; color: #fff; line-height: 1.5; }
    .is-intro { margin-bottom: 8px; font-size: 13px; color: #a1a1aa; }
    .is-intro strong { color: #fff; }
  `;
  shadow.appendChild(styles);

  // Create FAB
  const fab = document.createElement('button');
  fab.className = 'is-fab';
  fab.innerHTML = '🤖';
  fab.title = 'Open Instruction Structurer';
  shadow.appendChild(fab);

  // Create Sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'is-sidebar';
  sidebar.innerHTML = `
    <div class="is-header">
      <div class="is-header-left">
        <div class="is-logo">IS</div>
        <span class="is-title">Instruction Structurer</span>
      </div>
      <div class="is-header-btns">
        <button class="is-btn-icon is-btn-settings" title="Settings">⚙️</button>
        <button class="is-btn-icon is-btn-close" title="Close">✕</button>
      </div>
    </div>
    <div class="is-chat" id="is-chat">
      <div class="is-welcome">
        <span class="is-welcome-icon">🤖</span>
        <span class="is-welcome-title">Welcome to Instruction Structurer</span>
        <span class="is-welcome-text"></span>
      </div>Enter a topic or query below. I'll generate and classify instructions into: Simple, Sequence, Parallel, Purpose, Reason, or Exclusive types.
    </div>
    <div class="is-input-area">
      <div class="is-toggle-row">
        <label class="is-toggle"><input type="checkbox" id="is-extract" checked><span class="is-slider"></span></label>
        <span>Extract relevant content from page</span>
      </div>
      <div class="is-input-row">
        <textarea class="is-input" id="is-input" placeholder="Enter your query (e.g., 'make coffee')..." rows="1"></textarea>
        <button class="is-send" id="is-send" title="Send">➤</button>
      </div>
    </div>
  `;
  shadow.appendChild(sidebar);

  // Get elements from Shadow DOM
  const chatContainer = shadow.getElementById('is-chat');
  const inputField = shadow.getElementById('is-input');
  const sendBtn = shadow.getElementById('is-send');
  const closeBtn = shadow.querySelector('.is-btn-close');
  const settingsBtn = shadow.querySelector('.is-btn-settings');
  const extractToggle = shadow.getElementById('is-extract');

  // Toggle sidebar
  function openSidebar() {
    sidebar.classList.add('open');
    fab.classList.add('hidden');
    inputField.focus();
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    fab.classList.remove('hidden');
  }

  fab.addEventListener('click', openSidebar);
  closeBtn.addEventListener('click', closeSidebar);
  settingsBtn.addEventListener('click', () => chrome.runtime.sendMessage({ action: 'openSettings' }));

  // Auto-resize textarea
  inputField.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  // Send on Enter
  inputField.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function addMessage(content, type = 'user') {
    const welcome = chatContainer.querySelector('.is-welcome');
    if (welcome) welcome.remove();
    const msg = document.createElement('div');
    msg.className = `is-message ${type}`;
    msg.innerHTML = content + `<span class="is-time">${getTime()}</span>`;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return msg;
  }

  function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'is-loading';
    loading.id = 'is-loading';
    loading.innerHTML = `<div class="is-dots"><div class="is-dot"></div><div class="is-dot"></div><div class="is-dot"></div></div><span>Analyzing instructions...</span>`;
    chatContainer.appendChild(loading);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function hideLoading() {
    const loading = shadow.getElementById('is-loading');
    if (loading) loading.remove();
  }

  function extractPageContent(query) {
    const paragraphs = document.querySelectorAll('article p, article li, main p, main li, [role="main"] p, [role="main"] li, [itemprop="articleBody"] p, [itemprop="articleBody"] li, h1, h2, h3');
    const queryLower = (query || '').toLowerCase();
    const keywords = queryLower.split(/\s+/).filter(w => w.length > 2);
    let relevantContent = [];
    paragraphs.forEach(el => {
      if (el.closest('nav, footer, aside, header, .comment, #comments, [id*="comment"], [class*="comment"], .sidebar, .related, .recommend')) {
        return;
      }
      const text = el.innerText.trim();
      if (text.length > 20 && text.length < 500) {
        const textLower = text.toLowerCase();
        if (textLower.includes('http://') || textLower.includes('https://') || textLower.includes('www.')) return;
        const matchCount = keywords.length > 0 ? keywords.filter(kw => textLower.includes(kw)).length : 0;
        if (matchCount > 0) relevantContent.push({ text, score: matchCount });
      }
    });
    relevantContent.sort((a, b) => b.score - a.score);
    const topContent = relevantContent.slice(0, 8).map(c => c.text);

    if (topContent.length > 0) {
      return topContent.join('\n\n').slice(0, 4000);
    }

    const genericBlocks = [];
    paragraphs.forEach(el => {
      const text = el.innerText.trim();
      if (text.length >= 30 && text.length <= 300) {
        genericBlocks.push(text);
      }
    });

    const deduped = [];
    const seen = new Set();
    for (const block of genericBlocks) {
      const key = block.toLowerCase().slice(0, 80);
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(block);
      }
      if (deduped.length >= 12) break;
    }

    if (deduped.length > 0) {
      return deduped.join('\n\n').slice(0, 4000);
    }

    const bodyText = (document.body && document.body.innerText ? document.body.innerText : '').trim();
    return bodyText ? bodyText.slice(0, 4000) : null;
  }

  function isWebsiteIntent(query) {
    if (!query) return false;
    const q = query.toLowerCase();
    const websiteKeywords = [
      'website', 'web site', 'web page', 'webpage', 'browser', 'chrome', 'page content',
      'site content', 'this page', 'current page', 'from page', 'from website',
      'summarize web', 'summarize website', 'summarize webpage', 'summarise web',
      'summarise website', 'summerize web', 'summerize website', 'summerize webpage',
      'read my website', 'according to my web page',
      'based on this page', 'extract from page'
    ];
    return websiteKeywords.some(k => q.includes(k));
  }

  function getTypeClass(type) {
    const t = (type || '').toLowerCase();
    // Match new 7 categories
    if (t.includes('exclusive') && t.includes('object')) return 'is-type-exclusive-obj';
    if (t.includes('exclusive') && t.includes('action')) return 'is-type-exclusive-act';
    if (t.includes('exclusive')) return 'is-type-exclusive-obj';  // Default exclusive
    if (t.includes('parallel')) return 'is-type-parallel';
    if (t.includes('sequence') || t.includes('sequen')) return 'is-type-sequence';
    if (t.includes('purpose')) return 'is-type-purpose';
    if (t.includes('reason')) return 'is-type-reason';
    if (t.includes('simple')) return 'is-type-simple';
    return 'is-type-simple';  // Default fallback
  }

  function formatResponse(data, query) {
    let html = '';
    
    console.log('formatResponse received:', data);
    
    // Check for instructions array FIRST (from our new server)
    if (data.instructions && Array.isArray(data.instructions) && data.instructions.length > 0) {
      html += `<div class="is-intro">📋 <strong>${data.instructions.length}</strong> steps for "<strong>${query}</strong>"</div>`;
      data.instructions.forEach((inst, i) => {
        const text = inst.text || inst.instruction || String(inst);
        const type = inst.type || inst.category || 'Sequential';
        const typeClass = getTypeClass(type);
        html += `<div class="is-card"><span class="is-card-num">Step ${i + 1}</span><span class="is-card-text">${text}</span><span class="is-type ${typeClass}">${type}</span></div>`;
      });
      return html;
    }
    
    // Handle simple category response
    if (data.category) {
      const typeClass = getTypeClass(data.category);
      const displayText = query || 'Your instruction';
      html += `
        <div class="is-card">
          <span class="is-card-num">Classification Result</span>
          <span class="is-card-text">${displayText}</span>
          <span class="is-type ${typeClass}">${data.category}</span>
        </div>
      `;
      return html;
    }
    
    if (data.summary) {
      html += `<div class="is-summary"><span class="is-summary-label">Summary</span><span class="is-summary-text">${data.summary}</span></div>`;
    }
    
    if (data.raw && data.raw.length < 200) {
      html += `<div style="font-size: 14px; line-height: 1.6;">${data.raw}</div>`;
    } else if (data.mandatory || data.sequential || data.conditional) {
      let stepNum = 1;
      ['mandatory', 'sequential', 'conditional', 'exclusive', 'goals'].forEach(key => {
        if (data[key] && data[key].length > 0) {
          data[key].forEach(item => {
            const text = typeof item === 'string' ? item : `If ${item.condition}: ${item.action || (item.actions && item.actions.join(', '))}`;
            const typeClass = getTypeClass(key);
            const label = key === 'goals' ? 'Goal' : (key === 'exclusive' ? 'Choice' : `Step ${stepNum++}`);
            html += `<div class="is-card"><span class="is-card-num">${label}</span><span class="is-card-text">${text}</span><span class="is-type ${typeClass}">${key.charAt(0).toUpperCase() + key.slice(1)}</span></div>`;
          });
        }
      });
    }
    return html || `<div class="is-card"><span class="is-card-text">${query}</span><span class="is-type is-type-simple">Processed</span></div>`;
  }

  async function sendMessage() {
    const query = inputField.value.trim();
    if (!query) return;
    inputField.disabled = true;
    sendBtn.disabled = true;
    addMessage(query, 'user');
    inputField.value = '';
    inputField.style.height = 'auto';
    
    showLoading();

    const websiteIntent = isWebsiteIntent(query);
    const shouldUsePageContent = extractToggle.checked;
    const extractedContent = shouldUsePageContent ? extractPageContent(query) : null;

    const requestData = {
      text: query,
      query: query,
      hasPageContent: Boolean(extractedContent),
      mode: extractedContent ? 'website' : (websiteIntent ? 'website' : 'generate')
    };

    if (extractedContent) {
      requestData.website_content = extractedContent;
      requestData.pageContent = extractedContent;
    }
    
    chrome.runtime.sendMessage({ action: 'parse', ...requestData }, (response) => {
      hideLoading();
      inputField.disabled = false;
      sendBtn.disabled = false;
      inputField.focus();
      if (!response) {
        addMessage(`<div class="is-error">❌ No response from server. Make sure the inference server is running.</div>`, 'assistant');
        return;
      }
      if (response.error) {
        addMessage(`<div class="is-error">❌ Error: ${response.error}</div>`, 'assistant');
        return;
      }
      
      // Debug: log the response
      console.log('Full response:', JSON.stringify(response, null, 2));
      
      // Handle nested result structure
      let data = response.result || response;
      
      // If result is nested again, unwrap it
      if (data && data.result) {
        data = data.result;
      }
      
      console.log('Data to format:', JSON.stringify(data, null, 2));
      
      const formattedHtml = formatResponse(data, query);
      addMessage(formattedHtml, 'assistant');
    });
  }

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'toggleSidebar') {
      if (sidebar.classList.contains('open')) closeSidebar();
      else openSidebar();
    }
  });

})();
