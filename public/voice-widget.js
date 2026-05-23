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
      -webkit-overflow-scrolling: touch;
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
      white-space: pre-wrap;
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
    .aria-msg-interim {
      background: rgba(255, 255, 255, 0.03);
      border: 1px dashed rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.45);
      font-style: italic;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      animation: none;
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

    .aria-text-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 16px 16px;
      background: #0a0805;
    }
    #aria-text-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(184, 134, 11, 0.3);
      border-radius: 22px;
      padding: 10px 16px;
      color: var(--cream);
      font-size: 13.5px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      outline: none;
      transition: border-color 0.2s;
    }
    #aria-text-input::placeholder { color: rgba(255, 255, 255, 0.3); }
    #aria-text-input:focus { border-color: rgba(184, 134, 11, 0.6); }
    #aria-send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: var(--gold);
      color: #1a1510;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s, transform 0.2s;
    }
    #aria-send-btn:hover { background: var(--gold-light); transform: scale(1.06); }
    #aria-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    #aria-float-btn {
      position: fixed;
      bottom: 28px;
      right: 20px;
      height: 52px;
      width: auto;
      padding: 0 20px 0 16px;
      border-radius: 26px;
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
      border: none;
      color: #1a1510;
      z-index: 10000;
      display: none;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.04em;
      box-shadow: 0 4px 20px rgba(184, 134, 11, 0.55), 0 1px 4px rgba(0,0,0,0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #aria-float-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(184, 134, 11, 0.7), 0 2px 8px rgba(0,0,0,0.3);
    }
    #aria-float-label {
      white-space: nowrap;
    }

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
      0% { box-shadow: 0 0 0 0 rgba(184, 134, 11, 0.55); }
      70% { box-shadow: 0 0 0 14px rgba(184, 134, 11, 0); }
      100% { box-shadow: 0 0 0 0 rgba(184, 134, 11, 0); }
    }

    @media (max-width: 640px) {
      #aria-overlay {
        align-items: flex-end;
        padding: 0;
      }
      #aria-widget {
        width: 100vw;
        max-width: 100vw;
        height: 100vh;
        height: 100dvh;
        margin: 0;
        border-radius: 0;
        display: flex;
        flex-direction: column;
        animation: aria-slide-up 0.35s cubic-bezier(0.32, 0.72, 0, 1);
      }
      .aria-transcript {
        flex: 1;
        height: auto;
        -webkit-overflow-scrolling: touch;
      }
      .aria-text-wrap {
        padding-bottom: max(16px, env(safe-area-inset-bottom));
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
          <div class="aria-text-wrap">
            <input type="text" id="aria-text-input" placeholder="Type a message…" autocomplete="off" />
            <button id="aria-send-btn" title="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      </div>
      <button id="aria-float-btn" title="Chat with Aria">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
          <line x1="8" y1="22" x2="16" y2="22"/>
        </svg>
        <span id="aria-float-label">Chat with Aria</span>
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

    // Detect if user is confirming a booking so we show the right status
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    const isConfirming = lastUser && CONFIRM_WORDS_JS.some(w => lastUser.content.toLowerCase().includes(w));

    if (isConfirming && retryCount === 0) {
      setStatus('Saving…');
      setHint('Saving your appointment…');
    } else if (retryCount > 0) {
      setStatus('Reconnecting…');
      setHint('Please hold…');
    } else {
      setStatus('Thinking…');
      setHint('Aria is responding…');
    }

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
      if (retryCount < 2) {
        await new Promise(r => setTimeout(r, 2500));
        return sendToLLM(retryCount + 1);
      }
      const errMsg = isConfirming
        ? "I'm sorry, I had trouble saving your booking. Your details are still here — just say \"book it\" and I'll try again!"
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
