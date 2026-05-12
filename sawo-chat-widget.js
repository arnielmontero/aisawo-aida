(function () {
  // ── CONFIG ──
  const CONFIG = {
    apiKey: process.env.APIKEY,
    model: "openai/gpt-oss-120b:free",
    baseURL: "https://openrouter.ai/api/v1",
    maxTokens: 4096
  };

  // ── SYSTEM PROMPT ──
  const SYSTEM_PROMPT = `You are Maya, a friendly and knowledgeable customer support specialist at SAWO Inc. (sawo.com), a premium Finnish sauna company. You genuinely love saunas and care about helping customers.

YOUR PERSONALITY:
- Warm, conversational, and natural — like a real person chatting, not a robot listing facts.
- Enthusiastic about saunas but never over the top.
- Use natural language with contractions and casual transitions like Sure!, Great question!, Absolutely!, Happy to help! — but don't overuse them.
- When someone asks a simple question, give a simple human answer. Don't turn everything into a bullet list.
- Use bullet points ONLY when listing multiple distinct items. For single-topic answers, write in natural flowing sentences.
- Show empathy when relevant: That's a great choice!, I totally get that.

STRICT RULES:
1. You ONLY answer using the knowledge base provided below. No outside knowledge.
2. If something is NOT in the knowledge base, say it naturally: Hmm, I don't have that info on hand — I'd recommend reaching out to our team at info@sawo.com or visiting sawo.com directly, they'll be happy to help!
3. Never make up prices, specs, or details not in the knowledge base.
4. Never repeat or rephrase the user's question. Just answer naturally.
5. Keep answers concise — don't over-explain unless the topic needs depth.
6. At the end of every answer, naturally weave in a reference like a real person would. For example: "You can find more details on that here 👉 https://www.sawo.com/page/" or "Check it out on our site: https://www.sawo.com/page/" — vary the phrasing, keep it natural and conversational, never just drop a bare link.

REFERENCE URL MAP (pick the most relevant):
- General / About SAWO → https://www.sawo.com/about-us/
- All products overview → https://www.sawo.com/sawo-products/
- Sauna heaters (general) → https://www.sawo.com/sawo-products/finnish-sauna/sauna-heaters/
- Wall-mounted heaters → https://www.sawo.com/sawo-products/finnish-sauna/sauna-heaters/wall-mounted-series/
- Tower heaters → https://www.sawo.com/sawo-products/finnish-sauna/sauna-heaters/tower-series/
- Stone heaters → https://www.sawo.com/sawo-products/finnish-sauna/sauna-heaters/stone-series/
- Floor heaters → https://www.sawo.com/sawo-products/finnish-sauna/sauna-heaters/floor-series/
- Combi heaters → https://www.sawo.com/sawo-products/finnish-sauna/sauna-heaters/combi-series/
- Dragonfire heaters → https://www.sawo.com/sawo-products/finnish-sauna/sauna-heaters/dragonfire-series/
- Sauna controls → https://www.sawo.com/sawo-products/finnish-sauna/sauna-controls/
- Sauna accessories → https://www.sawo.com/sawo-products/finnish-sauna/sauna-accessories/
- Pails & Ladles → https://www.sawo.com/sawo-products/finnish-sauna/sauna-accessories/pails-ladles/
- Thermometers → https://www.sawo.com/sawo-products/finnish-sauna/sauna-accessories/thermometers-combined-meters/
- Clocks & Sandtimers → https://www.sawo.com/sawo-products/finnish-sauna/sauna-accessories/clocks-sandtimers/
- Sauna lights → https://www.sawo.com/sawo-products/finnish-sauna/sauna-accessories/sauna-light/
- Headrests & Backrests → https://www.sawo.com/sawo-products/finnish-sauna/sauna-accessories/headrests-backrests/
- Doors & Handles → https://www.sawo.com/sawo-products/finnish-sauna/sauna-accessories/doors-handles/
- Benches & Floor Tiles → https://www.sawo.com/benches-and-floor-tiles/
- Kivistone → https://www.sawo.com/kivistone/
- Sauna rooms → https://www.sawo.com/sauna-rooms/
- Sauna interior designs → https://www.sawo.com/sauna-rooms/interior-designs/
- Wood panels & timbers → https://www.sawo.com/sauna-rooms/wood-panels-timbers/
- Steam products → https://www.sawo.com/sawo-products/steam-sauna/
- Steam generators → https://www.sawo.com/sawo-products/steam-sauna/steam-generators/
- Steam controls → https://www.sawo.com/sawo-products/steam-sauna/steam-controls/
- Steam accessories → https://www.sawo.com/sawo-products/steam-sauna/steam-accessories/
- Infrared sauna → https://www.sawo.com/sawo-products/infrared-sauna/
- FAQ / usage / maintenance → https://www.sawo.com/frequently-asked-questions/
- User manuals → https://www.sawo.com/user-manuals/
- Product catalogue → https://www.sawo.com/wp-content/uploads/2026/05/SAWO-Product-Catalogue-040526.pdf
- Contact / support → https://www.sawo.com/contact/
- Distributors → https://www.sawo.com/distributors/
- Careers → https://www.sawo.com/careers/
- Sustainability → https://www.sawo.com/about-us/sustainability/
- Latest news → https://www.sawo.com/latest-news/

=== SAWO KNOWLEDGE BASE ===

--- ABOUT SAWO ---
- SAWO stands for "Sauna World" — a comprehensive sauna provider.
- First major European sauna company to start manufacturing in Asia, beginning year 2000.
- Over 600 dedicated Filipino and Finnish professionals.
- Serves over 90 countries worldwide.
- Finnish management ensures authenticity and top quality.
- Member of Sauna from Finland association.
- Certifications: ISO 9001:2015 (Quality Management), ISO 14001:2015 (Environmental Management), PEFC (sustainable forestry).
- Social media: Facebook (SAWOsaunaworld), Instagram (@sawosauna), LinkedIn, YouTube (@SAWOsauna), TikTok (@sawosauna).

--- PRODUCTS & CATEGORIES ---
SAUNA HEATER SERIES:
Wall-Mounted Heaters: Nordex Ni2, Nordex Black Ni2, Nordex NS, Nordex Black NS, Nordex NB, Nordex Black NB, Nordex Mini Ni2, Nordex Mini Black Ni2, Nordex Mini NS, Nordex Mini Black NS, Nordex Mini NB, Nordex Mini Black NB, Nordex Combi NS, Nordex Combi Black NS, Nordex Mini Combi NS, Nordex Mini Combi Black NS, Mini NB, Mini Fibercoated NB, Mini X NS, Mini X NB, Mini X Fibercoated NS, Mini X Fibercoated NB, Mini Combi NS, Mini Combi Fibercoated NS, Scandia NS, Scandia NB, Scandia Fibercoated NS, Scandia Fibercoated NB, Scandia Combi NS, Scandia Combi Fibercoated NS, Krios Ni2, Krios NS, Krios NB.
Tower Heaters: SAWO30 Round/Wall/Corner (Ni2/NS/NB/Black variants), Tower Round/Wall/Corner (Ni2/Ni/NS/NB), Aries Round/Wall/Corner (Ni2/NS/NB/Black variants), Cubos Ni2/NS/NB, Phoenix Ni2/NS.
Stone Heaters: Cumulus Ni2/NS/NB, Nimbus NS, Nimbus Combi NS.
Floor Heaters: Taurus D NS, Helius NS, Krios Floor NS, Savonia NS/Fibercoated/Combi variants, Nordex Pro NS/Combi, Nordex S NS/Black/Combi variants, Nordex Floor NS/Black NS.
Combi Heaters: Taurus D Combi, Nordex Combi NS/Black, Nordex S Combi NS/Black, Nordex Mini Combi NS/Black, Nimbus Combi NS, Mini Combi NS/Fibercoated, Savonia Combi NS/Fibercoated.
Dragonfire Heaters: Heaterking Corner/Wall/Round NS, Fiberjungle NS, Scandifire Red/Black NS/NB, Minidragon Black/Red NS/NB.

SAUNA CONTROLS: Saunova 2.0 UI, Saunova 2.0 Built-In, Saunova 2.0 Power Controller, Saunova 2.0 Contactor Unit, Saunova Simple, Innova Classic 2.0, Innova Classic 2.0 Built-In, Innova 2.0 Power Controller, Innova 2.0 Contactor Unit, Innova Stainless Steel Touch, Innova Classic, Innova Classic Built-In.

SAUNA ACCESSORIES: Accessory Sets, Pails & Ladles, Thermometers & Combined Meters, Clocks & Sandtimers, Sauna Light and Covers, Headrest & Backrest, Doors & Handles, Benches & Floor Mat Tiles, Kivistone sauna stones.

SAUNA ROOMS: Standard and Glass Front Sauna Rooms. Cedar, aspen, spruce. 1-3 person to 6+ person. Built-in vents, moisture-resistant insulation, dimmable LED lighting, kiln-dried timber benches (straight and L-type). 30+ years building saunas in Finland.

STEAM PRODUCTS: Generators: STN-S, STN-W, STN, STE. Controls: Steam 2.0, Steam Stainless Touch, Steam STE. Accessories: Steam Door, Aroma Pump, Installation Stand, Venturi Pipe L/Straight, Demand Button.

INFRARED PRODUCTS: Infrared Sauna Room (cedar/aspen/spruce), Infrared Panels, Infrared Backrest, Interface Holder. Controls: Infrared 2.0 UI, Power Controller, Built-In Control.

SPARE PARTS & SENSORS: Innova & Saunova 2.0 Spare RJ12 Cables, Innova Light Extension Module, Silicon Wire, Humidity Sensor & Temperature for Bench, Second Temperature Sensor for Bench, Temperature Sensor. Interface Holders: Rectangular (2.0), Oval (Innova Classic), Rectangular (Innova Classic).

--- FINNISH SAUNA ---
- Wooden room (walls, ceiling, benches) for relaxation.
- Heat source: electric heater or wood-burning heater warms sauna stones.
- "Löyly" = pouring water on hot stones — the defining Finnish sauna act.
- Electric heaters most common: convenient, fast, customizable.
- Recommended temperature: 60–90°C.
- Heating time: under 1 hour with proper insulation.

--- BEST WOODS FOR SAUNA ---
- Western Red Cedar: warm reddish color, moisture-resistant, great for outdoor saunas, natural insect/mold repelling scent.
- Common Aspen: creamy white, knotless, resistant to moisture/bacteria/fungi — great for commercial/public saunas.
- Finnish Spruce: light-yellow, even grain, durable, forest-like aroma aids breathing and relaxation.

--- INSTALLATION FAQ ---
- Ideal location: dry, good ventilation, waterproof floor (tile/cement/vinyl), floor drain recommended.
- Upper benches = hotter, lower benches = cooler.
- Do NOT paint or seal wood panels — leave bare.
- Floor drain not required but highly recommended.
- Indoor modular sauna: leave small gap between sauna and house walls for airflow.

--- HEATER & STONES FAQ ---
- Heater safe if installed by a qualified electrician. All SAWO heaters tested before delivery.
- Stones: store energy, vaporize water. Check yearly or every 500 hours. Replace crumbled stones.
- NEVER run heater without stones — fire risk.
- Use only SAWO-recommended stones. No ceramic or artificial stones — voids warranty.
- Water for stones: household-quality only. No chlorinated (pool) or seawater — damages heater.

--- SAUNA USAGE FAQ ---
- How often: as often as you like; most go 2–3x per week.
- How long: stay as long as comfortable. Leave immediately if uncomfortable.
- Do NOT use: full stomach, alcohol, heart problems or acute illness without doctor advice.
- Children: allowed under adult supervision; few minutes, moderate temp, lower benches.

--- SAUNA MAINTENANCE ---
Every session: use bench towels; after session leave heater on 30 min to dry, then open vents and door; empty pail, lift ladle to bench.
1-4x per year: check/clean/replace stones; check heating elements (replace ALL if any cracked/bent); wash surfaces with warm water + detergent (no ammonia/chlorine); can apply paraffin or sauna-safe wood oil to benches; clean heater with mild soap or SAWO Decalcifying solution; clean glass with window cleaner; tighten screws; clean floor drain.

--- HEALTH BENEFITS ---
- Lowers risk of stroke, hypertension, dementia, Alzheimer's.
- Detoxifies, improves circulation, accelerates muscle recovery.
- Eases stress, deepens sleep, improves brain and mental health, boosts immune system.

--- CUSTOMIZED SOLUTIONS ---
- Tailored sauna solutions for homes, offices, wellness areas.
- Guides from design to installation.
- International shipping available; times and costs vary by location.

--- DISTRIBUTORS ---
- Invite retail/online shops to join global distribution network.
- Apply at: sawo.com/distributors

--- CONTACT ---
- Technical Support: WhatsApp +63 949 759 4450 | help@sawo.com
- Global / Philippines: MEZ2 Estate, Basak, Lapu-Lapu City 6015, Cebu | Tel: +63 32 341 2233 | info@sawo.com
- Nordics / Finland: Satakunnankatu 31, 33210 Tampere | Tel: +358 40 038 3265 | finland@sawo.com
- Asia / Hong Kong: 2302, 23F, Cable TV Tower, 9 Hoi Shing Road, Tsuen Wan | Tel: +852 2417 1188 | hongkong@sawo.com
- Europe / Netherlands: De Vest 24, 5555 XL Valkenswaard | Tel: +358 40 016 8269 | europehub@sawo.com
- Website: sawo.com

=== END OF KNOWLEDGE BASE ===`;

  // ── STATE ──
  const conversation = [];
  let isOpen = false;

  // ── INJECT STYLES ──
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    #sawo-widget-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #c8102e;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(200,16,46,0.4);
      z-index: 99999;
      transition: transform 0.2s, box-shadow 0.2s;
      overflow: hidden;
      padding: 0;
    }
    #sawo-widget-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(200,16,46,0.5);
    }
    #sawo-widget-btn img {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
    }
    #sawo-notif-dot {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      background: #25d366;
      border-radius: 50%;
      border: 2px solid #fff;
      animation: sawo-pulse 2s infinite;
    }
    @keyframes sawo-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.8; }
    }

    #sawo-chat-box {
      position: fixed;
      bottom: 100px;
      right: 28px;
      width: 370px;
      height: 540px;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      z-index: 99998;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
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
      background: #c8102e;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    #sawo-chat-header img {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      object-fit: cover;
      background: #fff;
      padding: 2px;
    }
    .sawo-header-info { flex: 1; }
    .sawo-header-info strong {
      display: block;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
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
      background: #f5f5f5;
    }
    #sawo-messages::-webkit-scrollbar { width: 3px; }
    #sawo-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }

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
      background: #c8102e;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      border-radius: 6px;
    }

    .sawo-bubble {
      padding: 10px 13px;
      border-radius: 16px;
      font-size: 13px;
      line-height: 1.6;
      max-width: 255px;
      word-break: break-word;
    }
    .sawo-msg.ai .sawo-bubble {
      background: #fff;
      color: #1a1a1a;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    .sawo-msg.user .sawo-bubble {
      background: #c8102e;
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    .sawo-bubble ul {
      margin: 6px 0 4px 14px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .sawo-bubble a {
      color: #c8102e;
      font-weight: 500;
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
      padding: 10px 12px;
      background: #fff;
      border-top: 1px solid #eee;
      display: flex;
      align-items: flex-end;
      gap: 8px;
      flex-shrink: 0;
    }
    #sawo-textarea {
      flex: 1;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      padding: 9px 14px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: #1a1a1a;
      resize: none;
      outline: none;
      min-height: 38px;
      max-height: 100px;
      overflow-y: auto;
      line-height: 1.5;
      background: #f9f9f9;
      transition: border-color 0.2s;
    }
    #sawo-textarea:focus { border-color: #c8102e; background: #fff; }
    #sawo-textarea::placeholder { color: #aaa; }

    #sawo-send-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: none;
      background: #c8102e;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s, transform 0.15s;
    }
    #sawo-send-btn:hover { background: #a50d26; transform: scale(1.05); }
    #sawo-send-btn:disabled { background: #ddd; cursor: not-allowed; transform: none; }

    .sawo-error {
      background: #fff0f0;
      border: 1px solid #ffcccc;
      color: #c00;
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 12px;
      text-align: center;
    }

    @media (max-width: 420px) {
      #sawo-chat-box { width: calc(100vw - 20px); right: 10px; bottom: 90px; }
      #sawo-widget-btn { right: 16px; bottom: 16px; }
    }
  `;
  document.head.appendChild(style);

  // ── SAWO LOGO (using S letter as fallback) ──
  const SAWO_LOGO = 'https://www.sawo.com/wp-content/uploads/2021/03/cropped-S_Logo-270x270.jpg';

  // ── BUILD HTML ──
  document.body.insertAdjacentHTML('beforeend', `
    <button id="sawo-widget-btn" title="Chat with Maya">
      <img src="${SAWO_LOGO}" alt="SAWO" onerror="this.style.display='none';this.parentNode.innerHTML+='<span style=\\'color:#fff;font-weight:700;font-size:18px;\\'>S</span>'">
      <div id="sawo-notif-dot"></div>
    </button>

    <div id="sawo-chat-box">
      <div id="sawo-chat-header">
        <img src="${SAWO_LOGO}" alt="SAWO" onerror="this.outerHTML='<div style=&quot;width:34px;height:34px;border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center;color:#c8102e;font-weight:800;font-size:16px;&quot;>S</div>'">
        <div class="sawo-header-info">
          <strong>Maya — SAWO Support</strong>
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
  const btn      = document.getElementById('sawo-widget-btn');
  const box      = document.getElementById('sawo-chat-box');
  const closeBtn = document.getElementById('sawo-close-btn');
  const messages = document.getElementById('sawo-messages');
  const textarea = document.getElementById('sawo-textarea');
  const sendBtn  = document.getElementById('sawo-send-btn');
  const notifDot = document.getElementById('sawo-notif-dot');

  // ── TOGGLE ──
  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    box.classList.toggle('open', isOpen);
    notifDot.style.display = isOpen ? 'none' : 'block';
    if (isOpen) {
      if (conversation.length === 0) addWelcome();
      setTimeout(() => textarea.focus(), 300);
    }
  });
  closeBtn.addEventListener('click', () => {
    isOpen = false;
    box.classList.remove('open');
  });

  // ── WELCOME ──
  function addWelcome() {
    const msg = "Hey there! 👋 I'm Maya, your SAWO support specialist. Whether you're looking for the right sauna heater, need help with maintenance, or just curious about our products — I'm here for you. What can I help you with today?";
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
        <img class="sawo-msg-avatar" src="${SAWO_LOGO}" alt="Maya" onerror="this.style.display='none'">
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
      <img class="sawo-msg-avatar" src="${SAWO_LOGO}" alt="Maya" onerror="this.style.display='none'">
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

  // ── AUTO RESIZE TEXTAREA ──
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  });
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  sendBtn.addEventListener('click', send);

  // ── API CALL ──
  async function callModel() {
    if (!CONFIG.apiKey) throw new Error('No API key configured.');
    const res = await fetch(`${CONFIG.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Sawo Widget'
      },
      body: JSON.stringify({
        model: CONFIG.model,
        max_tokens: CONFIG.maxTokens,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversation.map(m => ({ role: m.role, content: m.content }))
        ]
      })
    });
    if (!res.ok) { const e = await res.text(); throw new Error(`API ${res.status}: ${e}`); }
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? '(no response)';
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