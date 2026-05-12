(function () {

  // ── STATE ──
  const conversation = [];
  let isOpen = false;

  // ── INJECT STYLES ──
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

    #sawo-widget-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      border: none;
      cursor: pointer;
      z-index: 99999;
      transition: opacity 0.3s ease, background 0.3s ease, width 0.3s ease, height 0.3s ease, border-radius 0.3s ease, color 0.3s ease, font-size 0.3s ease;
      overflow: visible;
      padding: 0;
      background: transparent;
      color: transparent;
      animation: sawo-float 3.5s ease-in-out infinite;
    }
    #sawo-widget-btn:hover {
      transform: scale(1.1);
      animation-play-state: paused;
    }
    #sawo-widget-btn img {
      display: block;
      height: 90px;
      width: auto;
    }
    #sawo-widget-btn.close-btn {
      width: 44px;
      height: 44px;
      background: rgba(175, 133, 100, 0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 24px;
      font-weight: 600;
      animation: none !important;
    }
    #sawo-widget-btn.close-btn:hover {
      background: rgba(175, 133, 100, 1);
    }
    #sawo-widget-btn.close-btn img {
      display: none;
    }
    #sawo-notif-dot {
      position: absolute;
      top: 8px;
      right: 12px;
      width: 12px;
      height: 12px;
      background: #25d366;
      border-radius: 50%;
      border: 2px solid #fff;
      animation: sawo-pulse 2s infinite;
    }
    @keyframes sawo-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.8; }
    }
    @keyframes sawo-float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }

    #sawo-chat-box {
      position: fixed;
      bottom: 100px;
      right: 28px;
      width: 370px;
      height: 540px;
      background: #fff;
      border-radius: 24px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.15);
      border: 1px solid rgba(175, 133, 100, 0.1);
      z-index: 99998;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Montserrat', sans-serif;
      transform: scale(0.85) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease;
      transform-origin: bottom right;
    }
    #sawo-chat-box.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    #sawo-chat-header {
      background: linear-gradient(135deg, #af8564 0%, #9d745a 100%);
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    #sawo-chat-header img {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      object-fit: contain;
      background: transparent;
      padding: 0;
    }
    .sawo-header-info { flex: 1; }
    .sawo-header-info strong {
      display: block;
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.3px;
    }
    .sawo-header-info span {
      color: rgba(255,255,255,0.8);
      font-size: 11px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .sawo-online-dot {
      width: 7px;
      height: 7px;
      background: #25d366;
      border-radius: 50%;
      display: inline-block;
    }
    #sawo-close-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      color: #fff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    #sawo-close-btn:hover { background: rgba(255,255,255,0.35); }

    #sawo-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #faf8f5;
    }
    #sawo-messages::-webkit-scrollbar { width: 4px; }
    #sawo-messages::-webkit-scrollbar-thumb { background: #d5c5b5; border-radius: 2px; }

    .sawo-msg {
      display: flex;
      gap: 8px;
      max-width: 100%;
      animation: sawo-fadein 0.25s ease;
    }
    @keyframes sawo-fadein {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .sawo-msg.user { flex-direction: row-reverse; }

    .sawo-msg-avatar {
      width: 26px;
      height: 26px;
      border-radius: 6px;
      object-fit: cover;
      flex-shrink: 0;
      margin-top: 2px;
      background: #fff;
    }
    .sawo-msg.user .sawo-msg-avatar {
      background: linear-gradient(135deg, #af8564 0%, #9d745a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      border-radius: 6px;
    }

    .sawo-bubble {
      padding: 11px 14px;
      border-radius: 16px;
      font-size: 13px;
      line-height: 1.65;
      max-width: 255px;
      word-break: break-word;
      font-family: 'Montserrat', sans-serif;
    }
    .sawo-msg.ai .sawo-bubble {
      background: #f9f7f4;
      color: #2a2420;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      font-weight: 500;
      line-height: 1.65;
    }
    .sawo-msg.user .sawo-bubble {
      background: linear-gradient(135deg, #af8564 0%, #9d745a 100%);
      color: #fff;
      border-bottom-right-radius: 4px;
      font-weight: 500;
    }
    .sawo-bubble ul {
      margin: 6px 0 4px 14px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .sawo-bubble a {
      color: #af8564;
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 2px;
      word-break: break-all;
    }
    .sawo-msg.user .sawo-bubble a { color: #ffe0e5; }
    .sawo-meta {
      font-size: 10px;
      color: #aaa;
      margin-top: 3px;
    }
    .sawo-msg.user .sawo-meta { text-align: right; }

    .sawo-typing {
      display: flex;
      gap: 4px;
      padding: 4px 2px;
      align-items: center;
    }
    .sawo-typing span {
      width: 7px; height: 7px;
      background: #bbb;
      border-radius: 50%;
      animation: sawo-bounce 1.2s ease-in-out infinite;
    }
    .sawo-typing span:nth-child(2) { animation-delay: 0.2s; }
    .sawo-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes sawo-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-6px); opacity: 1; }
    }

    #sawo-input-area {
      padding: 10px 14px;
      background: #fef9f5;
      border-top: 1px solid #ede3d8;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    #sawo-textarea {
      flex: 1;
      border: 1.5px solid #e8dfd5;
      border-radius: 20px;
      padding: 9px 15px;
      font-family: 'Montserrat', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: #2a2420;
      resize: none;
      outline: none;
      min-height: 38px;
      max-height: 100px;
      overflow-y: auto;
      line-height: 1.3;
      background: #faf8f5;
      transition: border-color 0.2s, background 0.2s;
      box-sizing: border-box;
    }
    #sawo-textarea:focus { border-color: #af8564; background: #fff; }
    #sawo-textarea::placeholder { color: #a89080; font-weight: 400; }

    #sawo-send-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #af8564 0%, #9d745a 100%);
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
      box-shadow: 0 2px 8px rgba(175, 133, 100, 0.3);
    }
    #sawo-send-btn:hover { background: linear-gradient(135deg, #9d745a 0%, #8b6947 100%); transform: scale(1.05); box-shadow: 0 3px 12px rgba(175, 133, 100, 0.4); }
    #sawo-send-btn:disabled { background: #ddd; cursor: not-allowed; transform: none; box-shadow: none; }

    .sawo-error {
      background: #ffe8e0;
      border: 1px solid #f5d4c5;
      color: #c85a40;
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
    }

    /* Tablet & Large Phone */
    @media (max-width: 768px) {
      #sawo-chat-box {
        width: calc(100vw - 20px);
        height: auto;
        max-height: 70vh;
        right: 10px;
        left: 10px;
        bottom: 100px;
      }
      #sawo-widget-btn {
        right: 16px;
        bottom: 16px;
      }
      #sawo-widget-btn img {
        height: 75px;
      }
    }

    /* Mobile Portrait */
    @media (max-width: 480px) {
      #sawo-chat-box {
        width: calc(100vw - 16px);
        height: 60vh;
        right: 8px;
        left: 8px;
        bottom: 80px;
        border-radius: 20px;
      }
      #sawo-chat-header {
        padding: 14px 16px;
      }
      #sawo-chat-header img {
        width: 36px;
        height: 36px;
      }
      .sawo-header-info strong {
        font-size: 14px;
      }
      .sawo-header-info span {
        font-size: 10px;
      }
      #sawo-close-btn {
        width: 26px;
        height: 26px;
        font-size: 14px;
      }
      #sawo-messages {
        padding: 12px 12px;
        gap: 10px;
      }
      .sawo-bubble {
        max-width: 220px;
        font-size: 12px;
        padding: 10px 12px;
      }
      #sawo-input-area {
        padding: 8px 12px;
        gap: 6px;
      }
      #sawo-textarea {
        padding: 8px 12px;
        min-height: 36px;
        font-size: 12px;
      }
      #sawo-send-btn {
        width: 36px;
        height: 36px;
      }
      #sawo-widget-btn {
        right: 12px;
        bottom: 12px;
      }
      #sawo-widget-btn img {
        height: 70px;
      }
    }

    /* Small Mobile */
    @media (max-width: 360px) {
      #sawo-chat-box {
        width: calc(100vw - 12px);
        height: 55vh;
        right: 6px;
        left: 6px;
        bottom: 75px;
      }
      #sawo-widget-btn img {
        height: 65px;
      }
      .sawo-bubble {
        max-width: 180px;
        font-size: 11px;
      }
    }

    /* Landscape Mode */
    @media (max-height: 600px) {
      #sawo-chat-box {
        height: 85vh;
        bottom: 70px;
      }
      #sawo-messages {
        padding: 12px 10px;
      }
      #sawo-widget-btn {
        bottom: 10px;
        right: 12px;
      }
    }
  `;
  document.head.appendChild(style);

  const SAWO_LOGO = 'https://www.sawo.com/wp-content/uploads/2021/03/cropped-S_Logo-270x270.jpg';

  // ── BUILD HTML ──
  document.body.insertAdjacentHTML('beforeend', `
    <button id="sawo-widget-btn" title="Chat with Aida">
      <img src="./toggle.png" alt="SAWO Chat" />
      <div id="sawo-notif-dot"></div>
    </button>

    <div id="sawo-chat-box">
      <div id="sawo-chat-header">
        <img src="https://aisawo.vercel.app/toggle2.png" alt="Aida">
        <div class="sawo-header-info">
          <strong>Ask Aida</strong>
          <span><span class="sawo-online-dot"></span> Online now</span>
        </div>
        <button id="sawo-close-btn">✕</button>
      </div>

      <div id="sawo-messages"></div>

      <div id="sawo-input-area">
        <textarea id="sawo-textarea" placeholder="Ask me anything about SAWO..." rows="1"></textarea>
        <button id="sawo-send-btn" title="Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `);

  // ── REFS ──
  const btn       = document.getElementById('sawo-widget-btn');
  const box       = document.getElementById('sawo-chat-box');
  const closeBtn  = document.getElementById('sawo-close-btn');
  const messages  = document.getElementById('sawo-messages');
  const textarea  = document.getElementById('sawo-textarea');
  const sendBtn   = document.getElementById('sawo-send-btn');

  // ── APPLY DEFAULT THEME (toggle2) ──
  btn.innerHTML = `
    <img src="https://aisawo.vercel.app/toggle2.png" alt="SAWO Chat" />
  `;

  function updateBtnState() {
    btn.style.opacity = '0';
    setTimeout(() => {
      if (isOpen) {
        btn.classList.add('close-btn');
        btn.innerHTML = '✕';
      } else {
        btn.classList.remove('close-btn');
        btn.innerHTML = `<img src="https://aisawo.vercel.app/toggle2.png" alt="SAWO Chat" />`;
      }
      btn.style.opacity = '1';
    }, 150);
  }

  // ── TOGGLE ──
  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    box.classList.toggle('open', isOpen);
    updateBtnState();
    if (isOpen) {
      if (conversation.length === 0) addWelcome();
      setTimeout(() => textarea.focus(), 300);
    }
  });
  closeBtn.addEventListener('click', () => {
    isOpen = false;
    box.classList.remove('open');
    updateBtnState();
  });

  // ── WELCOME ──
  function addWelcome() {
    const msg = "Hey there!👋 I'm Aida, here to assist you. What are you interested in?";
    // const msg = "Hey there! 👋 I'm Aida, your SAWO support specialist. Whether you're looking for the right sauna heater, need help with maintenance, or just curious about our products — I'm here for you. What can I help you with today?";
    conversation.push({ role: 'assistant', content: msg });
    appendMsg('ai', msg);
  }

  // ── HELPERS ──
  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function escapeHtml(t) {
    return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function renderMarkdown(text) {
    const urls = [];
    text = text.replace(/(https?:\/\/[^\s]+)/g, (url) => {
      urls.push(url);
      return `%%URL${urls.length - 1}%%`;
    });
    let html = escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^[\*\-] (.+)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
      .replace(/\n(?!<\/ul>|<ul|<li)/g, '<br>');
    html = html.replace(/%%URL(\d+)%%/g, (_, i) => {
      const url = urls[i];
      return `<a href="${url}" target="_blank" rel="noopener">${url}</a>`;
    });
    return html;
  }

  function appendMsg(role, text) {
    const div = document.createElement('div');
    div.className = `sawo-msg ${role}`;
    const content = role === 'ai' ? renderMarkdown(text) : escapeHtml(text);
    if (role === 'ai') {
      div.innerHTML = `
        <img class="sawo-msg-avatar" src="https://aisawo.vercel.app/toggle2.png" alt="Aida" onerror="this.style.display='none'">
        <div>
          <div class="sawo-bubble">${content}</div>
          <div class="sawo-meta">${getTime()}</div>
        </div>`;
    } else {
      div.innerHTML = `
        <div class="sawo-msg-avatar">You</div>
        <div>
          <div class="sawo-bubble">${content}</div>
          <div class="sawo-meta">${getTime()}</div>
        </div>`;
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function appendTyping() {
    const div = document.createElement('div');
    div.className = 'sawo-msg ai';
    div.innerHTML = `
      <img class="sawo-msg-avatar" src="https://aisawo.vercel.app/toggle2.png" alt="Aida" onerror="this.style.display='none'">
      <div>
        <div class="sawo-bubble">
          <div class="sawo-typing"><span></span><span></span><span></span></div>
        </div>
      </div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function showError(msg) {
    const div = document.createElement('div');
    div.className = 'sawo-error';
    div.textContent = '⚠ ' + msg;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  // ── AUTO RESIZE ──
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  });
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  sendBtn.addEventListener('click', send);

  // ── API CALL → your own backend, no key exposed ──
  async function callModel() {
    const res = await fetch('https://aisawo.vercel.app/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: conversation.map(m => ({ role: m.role, content: m.content })),
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `Server error ${res.status}`);
    }
    const data = await res.json();
    return data.reply;
  }

  // ── SEND ──
  async function send() {
    const text = textarea.value.trim();
    if (!text || sendBtn.disabled) return;

    conversation.push({ role: 'user', content: text });
    appendMsg('user', text);
    textarea.value = '';
    textarea.style.height = 'auto';
    sendBtn.disabled = true;
    textarea.disabled = true;

    const typing = appendTyping();
    try {
      const reply = await callModel();
      conversation.push({ role: 'assistant', content: reply });
      typing.remove();
      appendMsg('ai', reply);
    } catch (err) {
      typing.remove();
      showError(err.message || String(err));
    } finally {
      sendBtn.disabled = false;
      textarea.disabled = false;
      textarea.focus();
    }
  }

})();
