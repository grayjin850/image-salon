/* TO ACTIVATE: Add this single line before </body> in every HTML page:
   <script src="/voice-widget.js"></script>
*/

(function() {
  'use strict';

  if (window.location.pathname.startsWith('/admin')) return;

  // ---------- STEP 1: CSS ----------
  const css = `
    :root {
      --cream: #F5F0E8;
      --warm: #1a1510;
      --gold: #B8860B;
      --gold-light: #D4A017;
      --charcoal: #111111;
      --muted: #888888;
    }

    #aria-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      animation: aria-fade-in 0.3s ease-out;
    }
    #aria-overlay.aria-hidden { display: none; }

    #aria-widget {
      width: 100%;
      max-width: 420px;
      margin: 1rem;
      background: var(--warm);
      border: 1px solid rgba(184, 134, 11, 0.3);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .aria-header {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 18px 20px;
      background: linear-gradient(135deg, #1a1510 0%, #0f0c08 100%);
      border-bottom: 1px solid rgba(184, 134, 11, 0.25);
      position: relative;
    }

    .aria-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #1a1510;
      flex-shrink: 0;
    }

    .aria-name {
      font-size: 16px;
      color: var(--cream);
      letter-spacing: 0.05em;
    }
    .aria-name em {
      color: var(--gold);
      font-style: normal;
    }

    .aria-status {
      font-size: 11px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 2px;
    }

    .aria-close-btn {
      position: absolute;
      top: 14px;
      right: 16px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.06);
      color: var(--muted);
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, color 0.2s;
    }
    .aria-close-btn:hover {
      background: rgba(184, 134, 11, 0.15);
      color: var(--cream);
    }

    .aria-transcript {
      height: 260px;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
      background: #0e0b07;
    }
    .aria-transcript::-webkit-scrollbar { width: 4px; }
    .aria-transcript::-webkit-scrollbar-track { background: transparent; }
    .aria-transcript::-webkit-scrollbar-thumb {
      background: rgba(184, 134, 11, 0.4);
      border-radius: 4px;
    }

    .aria-msg {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 13.5px;
      line-height: 1.5;
      animation: aria-msg-in 0.25s ease-out;
      word-wrap: break-word;
    }
    .aria-msg-assistant {
      background: rgba(184, 134, 11, 0.12);
      border: 1px solid rgba(184, 134, 11, 0.25);
      color: var(--cream);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .aria-msg-user {
      background: rgba(255, 255, 255, 0.06);
      color: #ccc;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }

    .aria-visualizer {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      padding: 0 20px;
      background: #0a0805;
    }
    .aria-bar {
      width: 3px;
      height: 4px;
      border-radius: 3px;
      background: var(--gold);
      opacity: 0.35;
      transition: height 0.08s ease-out;
    }
    .aria-bar.aria-active { opacity: 0.85; }

    .aria-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 16px 20px 20px;
      background: #0a0805;
    }

    .aria-mic-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid var(--gold);
      background: transparent;
      color: var(--gold);
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: box-shadow 0.25s, background 0.25s, color 0.25s, transform 0.2s;
    }
    .aria-mic-btn:hover {
      box-shadow: 0 0 24px rgba(184, 134, 11, 0.45);
      transform: scale(1.04);
    }
    .aria-mic-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .aria-mic-btn.aria-listening {
      background: rgba(184, 134, 11, 0.18);
      animation: aria-pulse 1.4s ease-out infinite;
    }
    .aria-mic-btn.aria-speaking {
      color: var(--gold-light);
      box-shadow: 0 0 28px rgba(212, 160, 23, 0.55);
    }

    .aria-hint {
      font-size: 11px;
      color: var(--muted);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    #aria-float-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
      border: none;
      color: #1a1510;
      z-index: 10000;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 22px;
      box-shadow: 0 8px 32px rgba(184, 134, 11, 0.5);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #aria-float-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 10px 40px rgba(184, 134, 11, 0.7);
    }

    @keyframes aria-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes aria-msg-in {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes aria-pulse {
      0% { box-shadow: 0 0 0 0 rgba(184, 134, 11, 0.55); }
      70% { box-shadow: 0 0 0 14px rgba(184, 134, 11, 0); }
      100% { box-shadow: 0 0 0 0 rgba(184, 134, 11, 0); }
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
            <div class="aria-avatar">✦</div>
            <div>
              <div class="aria-name">Aria <em>Concierge</em></div>
              <div class="aria-status" id="aria-status-text">Ready</div>
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
        </div>
      </div>
      <button id="aria-float-btn" title="Open Aria">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
          <line x1="8" y1="22" x2="16" y2="22"/>
        </svg>
      </button>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  // ---------- STEP 3: State ----------
  let messages = [];
  let isListening = false;
  let isSpeaking = false;
  let wantsListening = false;
  let pendingGreeting = null;
  let recognition = null;
  let currentAudio = null;
  let animationFrame = null;

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
  async function speakText(text) {
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
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (currentAudio) {
        try { currentAudio.pause(); } catch (e) {}
        currentAudio = null;
      }

      const audio = new Audio(url);
      currentAudio = audio;

      const cleanup = () => {
        isSpeaking = false;
        if (micBtn) micBtn.classList.remove('aria-speaking');
        animateBars(false);
        setStatus('Ready');
        setHint('Tap to speak');
        URL.revokeObjectURL(url);
      };

      audio.onended = cleanup;
      audio.onerror = cleanup;

      try {
        await audio.play();
      } catch (err) {
        cleanup();
      }
    } catch (err) {
      isSpeaking = false;
      if (micBtn) micBtn.classList.remove('aria-speaking');
      animateBars(false);
      setStatus('Ready');
      setHint('Tap to speak');
    }
  }

  // ---------- STEP 6: LLM ----------
  async function sendToLLM() {
    wantsListening = false;
    if (recognition) try { recognition.stop(); } catch (e) {}
    setStatus('Thinking…');
    setHint('Aria is responding…');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      if (!res.ok || !data.text) throw new Error(data.error || 'no response');
      addMsg('assistant', data.text);
      if (data.booked) setStatus('Booked ✓');
      await speakText(data.text);
    } catch (err) {
      addMsg('assistant', "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.");
      setStatus('Error');
      setHint('Tap to speak');
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
    rec.interimResults = false;
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
      const text = event.results[0][0].transcript;
      addMsg('user', text);
      animateBars(false);
      sendToLLM();
    };

    rec.onerror = (event) => {
      isListening = false;
      if (micBtn) micBtn.classList.remove('aria-listening');
      if (event && event.error === 'no-speech') return;
      animateBars(false);
      setStatus('Ready');
      setHint('Tap to speak');
    };

    rec.onend = () => {
      isListening = false;
      if (micBtn) micBtn.classList.remove('aria-listening');
      if (wantsListening && !isSpeaking) {
        try { recognition.start(); } catch (e) {}
        return;
      }
      if (!isSpeaking) {
        animateBars(false);
        setStatus('Ready');
        setHint('Tap to speak');
      }
    };

    return rec;
  }

  // ---------- STEP 8: Start/stop listening ----------
  async function startListening() {
    if (isSpeaking) return;

    // Toggle OFF
    if (wantsListening) {
      wantsListening = false;
      if (recognition) try { recognition.stop(); } catch (e) {}
      animateBars(false);
      setStatus('Ready');
      setHint('Tap to speak');
      return;
    }

    // First tap: speak pending greeting (user gesture unlocks browser audio)
    if (pendingGreeting) {
      const g = pendingGreeting;
      pendingGreeting = null;
      await speakText(g);
      return;
    }

    // Toggle ON
    wantsListening = true;
    if (!recognition) recognition = initRecognition();
    if (!recognition) { wantsListening = false; return; }
    try {
      recognition.start();
    } catch (err) {
      try {
        recognition = initRecognition();
        if (recognition) recognition.start();
      } catch (e2) { wantsListening = false; }
    }
  }

  // ---------- STEP 9: Greeting ----------
  async function triggerGreeting() {
    if (messages.length !== 0) return;
    setStatus('Connecting…');
    const fallback = "Hello! I'm Aria, your salon concierge. How can I help you today?";
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
      await speakText(data.text);
      pendingGreeting = null;
    } catch (err) {
      addMsg('assistant', fallback);
      pendingGreeting = fallback;
      await speakText(fallback);
      pendingGreeting = null;
    }
    setStatus('Ready');
    setHint('Tap to speak');
  }

  // ---------- STEP 10: Open/close ----------
  function openOverlay() {
    if (overlay) overlay.classList.remove('aria-hidden');
    if (floatBtn) floatBtn.style.display = 'none';
    triggerGreeting();
  }

  function closeOverlay() {
    if (overlay) overlay.classList.add('aria-hidden');
    if (floatBtn) floatBtn.style.display = 'flex';
    if (isListening && recognition) {
      try { recognition.stop(); } catch (e) {}
    }
    if (isSpeaking && currentAudio) {
      try { currentAudio.pause(); } catch (e) {}
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
    micBtn.addEventListener('click', startListening);
    closeBtn.addEventListener('click', closeOverlay);
    floatBtn.addEventListener('click', openOverlay);

    triggerGreeting();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
