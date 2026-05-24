/* TO ACTIVATE: Add this single line before </body> in every HTML page:
   <script src="/voice-widget.js"></script>
*/

(function() {
  'use strict';

  if (window.location.pathname.startsWith('/admin')) return;

  // ---------- STEP 1: CSS ----------
  const css = `
    /* ── Aria SaaS Widget — Cream & Sage theme ── */

    #aria-overlay {
      position: fixed;
      inset: 0;
      background: rgba(28, 25, 23, 0.45);
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      animation: aria-fade-in 0.25s ease-out;
      padding: 1rem;
    }
    #aria-overlay.aria-hidden { display: none; }

    #aria-widget {
      width: 100%;
      max-width: 400px;
      background: #FFFFFF;
      border: 1px solid #E8E1D9;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 32px 100px rgba(28, 25, 23, 0.2), 0 0 0 1px rgba(74,124,89,0.06);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Plus Jakarta Sans", Roboto, sans-serif;
    }

    /* ── Header ── */
    .aria-header {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 18px 18px 18px 18px;
      background: linear-gradient(135deg, #4A7C59 0%, #3A6246 100%);
      position: relative;
    }

    .aria-avatar-wrap {
      position: relative;
      flex-shrink: 0;
    }
    .aria-avatar {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.18);
      border: 2px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }
    .aria-online-dot {
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #4ADE80;
      border: 2px solid #3A6246;
    }

    .aria-header-info { flex: 1; min-width: 0; }
    .aria-name {
      font-size: 15px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.01em;
      line-height: 1.2;
    }
    .aria-name em {
      display: block;
      font-style: normal;
      font-weight: 400;
      font-size: 11px;
      color: rgba(255,255,255,0.6);
      letter-spacing: 0.02em;
      margin-top: 1px;
    }
    .aria-status {
      font-size: 10.5px;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 3px;
    }

    .aria-close-btn {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.15);
      color: rgba(255,255,255,0.8);
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .aria-close-btn:hover { background: rgba(255,255,255,0.25); color: white; }

    /* ── Transcript ── */
    .aria-transcript {
      height: 260px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
      background: #FAF7F2;
    }
    .aria-transcript::-webkit-scrollbar { width: 4px; }
    .aria-transcript::-webkit-scrollbar-track { background: transparent; }
    .aria-transcript::-webkit-scrollbar-thumb { background: #D4A853; border-radius: 4px; }

    .aria-msg {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 13.5px;
      line-height: 1.55;
      animation: aria-msg-in 0.25s ease-out;
      word-wrap: break-word;
      white-space: pre-wrap;
    }
    .aria-msg-assistant {
      background: #FFFFFF;
      border: 1px solid #E8E1D9;
      color: #1C1917;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 4px rgba(28,25,23,0.06);
    }
    .aria-msg-user {
      background: #4A7C59;
      color: #FFFFFF;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .aria-msg-interim {
      background: rgba(74,124,89,0.07);
      border: 1px dashed rgba(74,124,89,0.25);
      color: rgba(28,25,23,0.4);
      font-style: italic;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      animation: none;
    }
    .aria-msg-loading {
      opacity: 0.8;
      animation: none !important;
    }
    .aria-typing-dots {
      display: inline-flex;
      gap: 3px;
      vertical-align: middle;
      margin-left: 4px;
    }
    .aria-typing-dots span {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #A8A29E;
      display: inline-block;
      animation: aria-dot 1.4s infinite ease-in-out;
      opacity: 0;
    }
    .aria-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .aria-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes aria-dot {
      0%, 80%, 100% { opacity: 0; transform: scale(0.8); }
      40%            { opacity: 1; transform: scale(1); }
    }
    .aria-booked-banner {
      align-self: stretch;
      background: linear-gradient(135deg, #EFF5F1 0%, #D9EDDF 100%);
      border: 1px solid #B7D9C2;
      border-radius: 14px;
      padding: 12px 14px;
      font-size: 13px;
      color: #1C5E30;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: aria-msg-in 0.3s ease-out;
    }

    /* ── Visualizer ── */
    .aria-visualizer {
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      padding: 0 20px;
      background: #FFFFFF;
      border-top: 1px solid #F0EBE3;
      border-bottom: 1px solid #F0EBE3;
    }
    .aria-bar {
      width: 3px;
      height: 3px;
      border-radius: 3px;
      background: #4A7C59;
      opacity: 0.25;
      transition: height 0.08s ease-out;
    }
    .aria-bar.aria-active { opacity: 0.75; }

    /* ── Controls ── */
    .aria-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px 20px 16px;
      background: #FFFFFF;
    }

    .aria-mic-btn {
      width: 62px;
      height: 62px;
      border-radius: 50%;
      border: none;
      background: #4A7C59;
      color: #FFFFFF;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: box-shadow 0.25s, transform 0.2s, background 0.25s;
      box-shadow: 0 4px 20px rgba(74,124,89,0.4);
    }
    .aria-mic-btn:hover {
      box-shadow: 0 6px 28px rgba(74,124,89,0.55);
      transform: scale(1.05);
    }
    .aria-mic-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
    .aria-mic-btn.aria-listening {
      background: #3A6246;
      animation: aria-pulse 1.5s ease-out infinite;
    }
    .aria-mic-btn.aria-speaking {
      background: #D4A853;
      box-shadow: 0 4px 24px rgba(212,168,83,0.55);
    }

    .aria-hint {
      font-size: 10.5px;
      color: #A8A29E;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    /* ── Text input ── */
    .aria-text-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 14px 16px;
      background: #FFFFFF;
    }
    #aria-text-input {
      flex: 1;
      background: #FAF7F2;
      border: 1px solid #E8E1D9;
      border-radius: 22px;
      padding: 10px 16px;
      color: #1C1917;
      font-size: 13.5px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    #aria-text-input::placeholder { color: #A8A29E; }
    #aria-text-input:focus { border-color: #4A7C59; box-shadow: 0 0 0 3px rgba(74,124,89,0.12); }
    #aria-send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: #4A7C59;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s, transform 0.2s;
      box-shadow: 0 2px 8px rgba(74,124,89,0.35);
    }
    #aria-send-btn:hover { background: #3A6246; transform: scale(1.06); }
    #aria-send-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

    /* ── Float button ── */
    #aria-float-btn {
      position: fixed;
      bottom: 28px;
      right: 24px;
      z-index: 10000;
      display: none;
      align-items: center;
      gap: 10px;
      padding: 10px 16px 10px 10px;
      border-radius: 22px;
      background: linear-gradient(135deg, #4A7C59 0%, #3A6246 100%);
      border: none;
      color: white;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-shadow: 0 8px 32px rgba(74,124,89,0.5), 0 2px 8px rgba(0,0,0,0.12);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      animation: aria-float-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }
    #aria-float-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 14px 40px rgba(74,124,89,0.6), 0 4px 12px rgba(0,0,0,0.15);
    }
    #aria-float-btn:active { transform: translateY(-1px); }

    .aria-float-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255,255,255,0.18);
      border: 1.5px solid rgba(255,255,255,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      flex-shrink: 0;
    }
    .aria-float-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
      text-align: left;
    }
    .aria-float-title {
      font-size: 13px;
      font-weight: 700;
      color: white;
      letter-spacing: -0.01em;
      white-space: nowrap;
    }
    .aria-float-sub {
      font-size: 10px;
      color: rgba(255,255,255,0.65);
      white-space: nowrap;
      letter-spacing: 0.02em;
    }
    .aria-float-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #EF4444;
      border: 2px solid white;
      font-size: 9px;
      font-weight: 800;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 0;
    }

    /* Pulsing glow ring behind float button */
    #aria-float-ring {
      position: fixed;
      bottom: 22px;
      right: 18px;
      z-index: 9999;
      width: calc(100% - 42px + 28px);
      pointer-events: none;
      display: none;
    }
    #aria-float-ring.aria-ring-visible {
      display: block;
      animation: aria-ring-pulse 2.8s ease-in-out infinite;
    }
    @keyframes aria-ring-pulse {
      0%, 100% { opacity: 0; transform: scale(0.95); }
      40% { opacity: 1; transform: scale(1.04); }
    }

    /* ── Keyframes ── */
    @keyframes aria-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes aria-slide-up {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes aria-msg-in {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes aria-pulse {
      0%   { box-shadow: 0 4px 20px rgba(74,124,89,0.4), 0 0 0 0 rgba(74,124,89,0.5); }
      70%  { box-shadow: 0 4px 20px rgba(74,124,89,0.4), 0 0 0 16px rgba(74,124,89,0); }
      100% { box-shadow: 0 4px 20px rgba(74,124,89,0.4), 0 0 0 0 rgba(74,124,89,0); }
    }
    @keyframes aria-float-entrance {
      from { transform: translateY(80px) scale(0.8); opacity: 0; }
      to   { transform: translateY(0) scale(1); opacity: 1; }
    }

    /* ── Mobile bottom sheet ── */
    @media (max-width: 640px) {
      #aria-overlay {
        align-items: flex-end;
        padding: 0;
        background: rgba(28, 25, 23, 0.28);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
      #aria-widget {
        width: 100vw;
        max-width: 100vw;
        height: 80vh;
        height: 80dvh;
        max-height: 85dvh;
        margin: 0;
        border-radius: 24px 24px 0 0;
        border: none;
        display: flex;
        flex-direction: column;
        animation: aria-slide-up 0.35s cubic-bezier(0.32, 0.72, 0, 1);
        box-shadow: 0 -16px 64px rgba(28, 25, 23, 0.22), 0 -1px 0 rgba(255,255,255,0.08);
      }
      .aria-transcript {
        flex: 1;
        height: auto;
      }
      .aria-text-wrap {
        padding-bottom: max(16px, env(safe-area-inset-bottom));
      }
      #aria-float-btn {
        bottom: 20px;
        right: 16px;
      }
    }
  `;

  function injectStyle() {
    const style = document.createElement('style');
    style.id = 'aria-widget-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---------- STEP 2: HTML ----------
  function injectHTML() {
    const bars = Array.from({ length: 18 }, () => '<div class="aria-bar"></div>').join('');
    const html = `
      <div id="aria-overlay">
        <div id="aria-widget">
          <div class="aria-header">
            <div class="aria-avatar-wrap">
              <div class="aria-avatar">✦</div>
              <div class="aria-online-dot"></div>
            </div>
            <div class="aria-header-info">
              <div class="aria-name">Aria <em>Image Salon · AI Frontdesk</em></div>
              <div class="aria-status" id="aria-status-text">Online now</div>
            </div>
            <button class="aria-close-btn" id="aria-close-btn" title="Minimize">×</button>
          </div>
          <div class="aria-transcript" id="aria-transcript"></div>
          <div class="aria-visualizer" id="aria-visualizer">${bars}</div>
          <div class="aria-controls">
            <button class="aria-mic-btn" id="aria-mic-btn" title="Tap to speak">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
                <line x1="8" y1="22" x2="16" y2="22"/>
              </svg>
            </button>
            <div class="aria-hint" id="aria-hint-text">Tap to speak</div>
          </div>
          <div class="aria-text-wrap">
            <input type="text" id="aria-text-input" placeholder="Type a message…" autocomplete="off" />
            <button id="aria-send-btn" title="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      </div>
      <button id="aria-float-btn" title="Talk to Aria">
        <div class="aria-float-avatar">✦</div>
        <div class="aria-float-text">
          <span class="aria-float-title">Talk to Aria</span>
          <span class="aria-float-sub">AI Frontdesk · Ask me anything</span>
        </div>
        <span class="aria-float-badge">1</span>
      </button>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  // ---------- STEP 3: State ----------
  let messages = [];
  let isListening = false;
  let isSpeaking = false;
  let conversationActive = false;
  let processingUtterance = false;
  let intentionalStop = false;
  let restartTimer = null;
  let interimMsgEl = null;
  let loadingMsgEl = null;
  let pendingGreeting = null;
  let recognition = null;
  let currentAudio = null;
  let animationFrame = null;
  let audioCtx = null;

  // Element refs (assigned in init)
  let overlay, transcript, micBtn, closeBtn, floatBtn, statusText, hintText, vizBars;

  // ---------- STEP 4: Helpers ----------
  function setStatus(text) {
    if (statusText) statusText.textContent = text;
  }
  function setHint(text) {
    if (hintText) hintText.textContent = text;
  }

  function addMsg(role, text) {
    if (!transcript) return;
    const div = document.createElement('div');
    div.className = `aria-msg aria-msg-${role}`;
    div.textContent = text;
    transcript.appendChild(div);
    transcript.scrollTop = transcript.scrollHeight;
    if (role === 'user' || role === 'assistant') {
      messages.push({ role, content: text });
    }
  }

  function showInterim(text) {
    if (!transcript) return;
    if (!interimMsgEl) {
      interimMsgEl = document.createElement('div');
      interimMsgEl.className = 'aria-msg aria-msg-interim';
      transcript.appendChild(interimMsgEl);
    }
    interimMsgEl.textContent = text;
    transcript.scrollTop = transcript.scrollHeight;
  }

  function clearInterim() {
    if (interimMsgEl) {
      interimMsgEl.remove();
      interimMsgEl = null;
    }
  }

  function showLoadingMsg(text) {
    if (!transcript) return;
    if (loadingMsgEl) loadingMsgEl.remove();
    loadingMsgEl = document.createElement('div');
    loadingMsgEl.className = 'aria-msg aria-msg-assistant aria-msg-loading';
    loadingMsgEl.innerHTML = text +
      '<span class="aria-typing-dots"><span></span><span></span><span></span></span>';
    transcript.appendChild(loadingMsgEl);
    transcript.scrollTop = transcript.scrollHeight;
  }

  function removeLoadingMsg() {
    if (loadingMsgEl) { loadingMsgEl.remove(); loadingMsgEl = null; }
  }

  function animateBars(active) {
    if (!vizBars || vizBars.length === 0) return;
    const barsArr = Array.from(vizBars);
    if (!active) {
      barsArr.forEach((b) => {
        b.classList.remove('aria-active');
        b.style.height = '4px';
      });
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      return;
    }
    barsArr.forEach((b) => b.classList.add('aria-active'));
    const tick = () => {
      barsArr.forEach((b) => {
        b.style.height = (4 + Math.random() * 32) + 'px';
      });
      animationFrame = requestAnimationFrame(tick);
    };
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(tick);
  }

  // ---------- STEP 5: TTS ----------
  // Uses AudioContext for reliable cross-call playback.
  // retryCount is internal — callers always call speakText(text) with one arg.
  async function speakText(text, retryCount) {
    retryCount = retryCount || 0;

    const resetState = () => {
      isSpeaking = false;
      processingUtterance = false;
      intentionalStop = false;
      if (micBtn) micBtn.classList.remove('aria-speaking');
      animateBars(false);
      setStatus('Ready');
      setHint('Tap to speak');
    };

    try {
      isSpeaking = true;
      setStatus('Speaking…');
      if (micBtn) micBtn.classList.add('aria-speaking');
      animateBars(true);

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(`TTS error ${res.status}`);

      if (!audioCtx) {
        try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        try { await audioCtx.resume(); } catch (e) {}
      }
      if (!audioCtx) throw new Error('AudioContext unavailable');

      // If context is still suspended after resume, skip audio so conversation doesn't hang
      if (audioCtx.state !== 'running') {
        resetState();
        if (conversationActive && overlay && !overlay.classList.contains('aria-hidden')) {
          setTimeout(startListening, 400);
        }
        return false;
      }

      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      if (currentAudio) {
        try { currentAudio.stop(); } catch (e) {}
        currentAudio = null;
      }

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      currentAudio = source;

      let cleanupDone = false;
      const cleanup = () => {
        if (cleanupDone) return;
        cleanupDone = true;
        currentAudio = null;
        resetState();
        if (conversationActive && overlay && !overlay.classList.contains('aria-hidden')) {
          setTimeout(startListening, 400);
        }
      };

      source.onended = cleanup;
      source.start(0);
      return true;

    } catch (err) {
      // Retry once on TTS failure (edge_tts can return empty audio on network hiccup)
      if (retryCount < 1) {
        resetState();
        isSpeaking = true;
        await new Promise(r => setTimeout(r, 1200));
        return speakText(text, retryCount + 1);
      }
      // Final failure — reset and keep conversation alive
      resetState();
      if (conversationActive && overlay && !overlay.classList.contains('aria-hidden')) {
        setTimeout(startListening, 400);
      }
      return false;
    }
  }

  // ---------- STEP 6: LLM ----------
  // STT phonetic corrections — browser speech API mishears salon terms
  const SPEECH_CORRECTIONS = {
    'ribbon': 'rebond',
    'ribbons': 'rebonds',
  };
  function correctTranscript(text) {
    return text.replace(/\b(ribbon|ribbons)\b/gi, (m) => {
      const key = m.toLowerCase();
      const fix = SPEECH_CORRECTIONS[key];
      return fix ? (m[0] === m[0].toUpperCase() ? fix.charAt(0).toUpperCase() + fix.slice(1) : fix) : m;
    });
  }

  const CONFIRM_WORDS_JS = ['yes', 'yep', 'yeah', 'yup', 'ok', 'okay', 'sure', 'definitely',
    'confirmed', 'go ahead', 'book it', "let's do it", 'please book', 'do it', 'sounds good', 'perfect'];

  async function sendToLLM(retryCount) {
    retryCount = retryCount || 0;

    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    const isConfirming = lastUser && CONFIRM_WORDS_JS.some(w => lastUser.content.toLowerCase().includes(w));

    if (isConfirming && retryCount === 0) {
      setStatus('Saving…');
      setHint('Saving your appointment…');
      showLoadingMsg('One moment, I\'m reserving your appointment');
    } else if (retryCount > 0 && isConfirming) {
      setStatus('Reconnecting…');
      setHint('Almost there…');
      showLoadingMsg('Reconnecting, almost there');
    } else if (retryCount > 0) {
      setStatus('Reconnecting…');
      setHint('Please hold…');
      showLoadingMsg('Reconnecting, please hold');
    } else {
      setStatus('Thinking…');
      setHint('Aria is responding…');
      showLoadingMsg('Let me check on that');
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      if (!res.ok || !data.text) throw new Error(data.error || 'no response');

      removeLoadingMsg();
      addMsg('assistant', data.text);

      if (data.booked) {
        setStatus('Booked ✓');
        // Show a booking success banner in the transcript
        const banner = document.createElement('div');
        banner.className = 'aria-booked-banner';
        banner.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Appointment confirmed!';
        if (transcript) {
          transcript.appendChild(banner);
          transcript.scrollTop = transcript.scrollHeight;
        }
      }

      await speakText(data.text);
    } catch (err) {
      if (retryCount < 2) {
        await new Promise(r => setTimeout(r, 2500));
        return sendToLLM(retryCount + 1);
      }
      removeLoadingMsg();
      const errMsg = isConfirming
        ? "I'm so sorry, I had a little trouble saving your booking. Your details are still here — just say \"book it\" and I'll try again!"
        : "I'm sorry, I'm having a little trouble right now. Please give me a moment and try again.";
      addMsg('assistant', errMsg);
      await speakText(errMsg);
    }
  }

  // ---------- STEP 7: STT ----------
  function initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHint('Voice not supported in this browser');
      if (micBtn) micBtn.disabled = true;
      return null;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onstart = () => {
      isListening = true;
      if (micBtn) micBtn.classList.add('aria-listening');
      setStatus('Listening…');
      setHint('Speak now…');
      animateBars(true);
    };

    rec.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      if (interim) showInterim(interim);
      if (final.trim()) {
        clearInterim();
        processingUtterance = true;
        intentionalStop = true;
        try { rec.stop(); } catch (e) {}
        addMsg('user', correctTranscript(final.trim()));
        animateBars(false);
        sendToLLM();
      }
    };

    rec.onerror = (event) => {
      const errorType = event && event.error ? event.error : 'unknown';
      console.log('[Aria] speech error:', errorType);

      if (errorType === 'not-allowed' || errorType === 'audio-capture') {
        // Fatal — mic is blocked, stop trying
        isListening = false;
        if (micBtn) micBtn.classList.remove('aria-listening');
        conversationActive = false;
        intentionalStop = true;
        animateBars(false);
        setStatus('Mic blocked');
        setHint(errorType === 'not-allowed' ? 'Allow mic in settings' : 'Check microphone');
        return;
      }
      // no-speech / network / aborted — onend will fire next and handle silent restart.
      // Don't touch UI here so the mic button stays lit with no flicker.
    };

    rec.onend = () => {
      isListening = false;

      if (intentionalStop || !conversationActive || isSpeaking) {
        // Expected stop (user tapped off, speech captured, or speaking) — update UI
        if (micBtn) micBtn.classList.remove('aria-listening');
        intentionalStop = false;
        if (!isSpeaking) {
          animateBars(false);
          setStatus('Ready');
          setHint('Tap to speak');
        }
        return;
      }

      // Browser killed the session unexpectedly (iOS Safari / Android no-speech timeout).
      // Restart silently — keep mic lit and status showing "Listening…" so user sees
      // no flicker during the 300ms restart gap.
      restartTimer = setTimeout(() => {
        restartTimer = null;
        clearInterim();
        if (conversationActive && !isSpeaking && !isListening) {
          recognition = initRecognition();
          if (recognition) {
            intentionalStop = false;
            try { recognition.start(); } catch (e) {
              if (micBtn) micBtn.classList.remove('aria-listening');
              animateBars(false);
              setStatus('Ready');
              setHint('Tap to speak');
            }
          }
        }
      }, 300);
    };

    return rec;
  }

  // ---------- STEP 8: Start/stop listening ----------
  // userGesture=true means the user tapped the mic button explicitly.
  // Auto-restarts (from speakText cleanup) pass userGesture=false so they
  // never accidentally trigger the toggle-off path.
  async function startListening(userGesture) {
    if (isSpeaking) return;

    // Toggle OFF — only when the user taps while a conversation is running
    if (userGesture && (isListening || conversationActive)) {
      conversationActive = false;
      processingUtterance = false;
      intentionalStop = true;
      clearInterim();
      if (restartTimer) { clearTimeout(restartTimer); restartTimer = null; }
      if (recognition) try { recognition.stop(); } catch (e) {}
      animateBars(false);
      setStatus('Ready');
      setHint('Tap to speak');
      return;
    }

    // First tap unlocks audio and speaks pending greeting
    if (pendingGreeting) {
      const g = pendingGreeting;
      pendingGreeting = null;
      await speakText(g);
      return;
    }

    // Always create a fresh instance — reusing an ended object throws InvalidStateError silently
    recognition = initRecognition();
    if (!recognition) return;
    conversationActive = true;
    try {
      recognition.start();
    } catch (err) { conversationActive = false; }
  }

  // ---------- STEP 9: Greeting ----------
  async function triggerGreeting() {
    if (messages.length !== 0) return;
    setStatus('Connecting…');
    const fallback = "Hi! I'm Aria. I'm here to help you. Would you like to book an appointment with us, or explore our website first? Feel free to hide me anytime — just click the X above!";
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] }),
      });
      const data = await res.json();
      if (!res.ok || !data.text) throw new Error('no response');
      addMsg('assistant', data.text);
      pendingGreeting = data.text;
      const played = await speakText(data.text);
      if (played) pendingGreeting = null;
    } catch (err) {
      addMsg('assistant', fallback);
      pendingGreeting = fallback;
      const played = await speakText(fallback);
      if (played) pendingGreeting = null;
    }
    setStatus('Ready');
    setHint('Tap to speak');
  }

  // ---------- STEP 10: Open/close ----------
  function openOverlay() {
    if (overlay) overlay.classList.remove('aria-hidden');
    if (floatBtn) floatBtn.style.display = 'none';
    // Dismiss notification badge on first open
    const badge = document.querySelector('.aria-float-badge');
    if (badge) badge.style.display = 'none';
    triggerGreeting();
  }

  function closeOverlay() {
    if (overlay) overlay.classList.add('aria-hidden');
    if (floatBtn) floatBtn.style.display = 'flex';
    if (isListening && recognition) {
      try { recognition.stop(); } catch (e) {}
    }
    if (isSpeaking && currentAudio) {
      try { currentAudio.stop(); } catch (e) {}
      currentAudio = null;
      isSpeaking = false;
      if (micBtn) micBtn.classList.remove('aria-speaking');
    }
    animateBars(false);
    setStatus('Ready');
  }

  // ---------- STEP 12: Init ----------
  function init() {
    injectStyle();
    injectHTML();

    overlay = document.getElementById('aria-overlay');
    transcript = document.getElementById('aria-transcript');
    micBtn = document.getElementById('aria-mic-btn');
    closeBtn = document.getElementById('aria-close-btn');
    floatBtn = document.getElementById('aria-float-btn');
    statusText = document.getElementById('aria-status-text');
    hintText = document.getElementById('aria-hint-text');
    vizBars = document.querySelectorAll('.aria-bar');

    // STEP 11: Event listeners
    micBtn.addEventListener('click', async () => {
      if (!audioCtx) {
        try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        try { await audioCtx.resume(); } catch (e) {}
      }
      startListening(true);
    });
    closeBtn.addEventListener('click', closeOverlay);
    floatBtn.addEventListener('click', openOverlay);

    const textInput = document.getElementById('aria-text-input');
    const sendBtn = document.getElementById('aria-send-btn');

    function sendTypedMessage() {
      const text = textInput.value.trim();
      if (!text || isSpeaking || processingUtterance) return;
      textInput.value = '';
      conversationActive = true;
      clearInterim();
      addMsg('user', text);
      processingUtterance = true;
      sendToLLM();
    }

    textInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!audioCtx) {
          try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e2) {}
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          try { await audioCtx.resume(); } catch (e2) {}
        }
        sendTypedMessage();
      }
    });
    sendBtn.addEventListener('click', async () => {
      if (!audioCtx) {
        try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        try { await audioCtx.resume(); } catch (e) {}
      }
      sendTypedMessage();
    });

    // Mobile keyboard: push input bar above keyboard when it opens
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        const textWrap = document.querySelector('.aria-text-wrap');
        if (textWrap && overlay && !overlay.classList.contains('aria-hidden')) {
          const keyboardHeight = Math.max(0, window.innerHeight - window.visualViewport.height);
          textWrap.style.paddingBottom = Math.max(16, keyboardHeight) + 'px';
        }
      });
    }

    // Play greeting on first user gesture (unlocks browser audio)
    document.addEventListener('click', async function onFirstClick() {
      document.removeEventListener('click', onFirstClick);
      // Create AudioContext on first gesture to unlock audio for all future plays
      if (!audioCtx) {
        try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
      }
      if (pendingGreeting) {
        const g = pendingGreeting;
        pendingGreeting = null;
        await speakText(g);
      }
    }, { once: true });

    triggerGreeting();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
