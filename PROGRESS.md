# PROGRESS

## Phase 1 — Voice AI Reservation Agent — 2026-05-22

### Tasks Completed
- [x] Task 1 — /api/chat.py (claude-opus-4-7)
- [x] Task 2 — /api/tts.py (claude-sonnet-4-6)
- [x] Task 3 — /public/voice-widget.js (claude-opus-4-7)
- [x] Task 4 — /public/voice-widget.css (inline)
- [x] Task 5 — requirements.txt (inline)
- [x] Task 6 — .env.example (inline)

### Files Created (new — no existing files modified)
- `api/chat.py` — Vercel Python serverless function: RAG services fetch, OpenRouter LLM, tool-call booking insert
- `api/tts.py` — Vercel Python serverless function: edge-tts MP3 generation, en-US-JennyNeural voice
- `public/voice-widget.js` — Self-contained vanilla JS widget (~550 lines), IIFE, STT + TTS + chat loop
- `public/voice-widget.css` — Empty placeholder (all styles embedded in JS)
- `requirements.txt` — edge-tts, supabase, httpx
- `.env.example` — Template for all required env vars

### Key Decisions
- BaseHTTPRequestHandler pattern for both Python functions (Vercel Python runtime)
- z-index 10001 for overlay (above body::after grain at 9999, below cursor at 99997)
- Float button starts `display: none`; overlay starts visible (no aria-hidden)
- DOMContentLoaded guard with `readyState === 'loading'` check for Next.js compatibility

### Activation — IMPORTANT for Next.js
This project is Next.js App Router, not plain HTML. The widget activation differs:

Add to `app/layout.tsx` inside `<body>`:
```tsx
<Script src="/voice-widget.js" strategy="afterInteractive" />
```
Or as a plain `<script>` tag before `</body>` in layout.tsx.

### Env Vars Needed (add to .env.local or Vercel dashboard)
- `OPENROUTER_API_KEY` — from openrouter.ai
- `SUPABASE_URL` — full Supabase project URL (server-side, use service key)
- `SUPABASE_SERVICE_KEY` — Supabase service role key (NOT the anon key)
- `SITE_URL` — your deployed URL for OpenRouter HTTP-Referer header

### Verification Result
- Command run: manual file inspection
- Result: PASSED — all 6 files created, no existing files modified

---

## Phase 2 — Widget Activation — 2026-05-22

### Tasks Completed
- [x] Task 1 — Add script tag to app/layout.tsx (claude-haiku-4-5)

### Files Modified
- `app/layout.tsx` — added `<script src="/voice-widget.js" defer></script>` before `</body>`

### Verification Result
- Command run: manual inspection
- Result: PASSED — script tag inserted after Footer, widget loads on every page

---

## Priority 1 — Greeting + Personality — 2026-05-23

### Tasks Completed
- [x] 1.1 — Update system prompt in api/chat.py (claude-sonnet-4-6)
- [x] 1.2 — Update fallback greeting in voice-widget.js (claude-haiku-4-5)

### Files Modified
- `api/chat.py` — Rewrote SYSTEM_PROMPT_TEMPLATE: new Aria greeting, CONVERSATION RULES (no premature booking push), updated BOOKING FLOW section
- `public/voice-widget.js` — Updated fallback greeting string to new Aria 4-line greeting

### Key Changes
- Greeting changed from "Hello! I'm Aria, your salon concierge..." to new 4-line greeting with booking/exploring choice
- Added booking trigger word list: book, reserve, schedule, appointment, yes I want to book, let's do it
- Rule added: NEVER assume user wants to book — answer questions fully first
- Rule added: never show YYYY-MM-DD format to user

### Notes for Next Priority (P2)
- api/chat.py still has tool_choice: "auto" — LLM can call book_appointment at any time (no code-level gate yet)

### Verification
- No build step needed — Python serverless + static JS, no DB touched

---

## Priority 3 — LLM Provider Fallback Chain — 2026-05-23

### Tasks Completed
- [x] 3.1 — Add provider helpers + constants before class handler (claude-sonnet-4-6)
- [x] 3.2 — Replace do_POST provider loop with 3-provider fallback (claude-sonnet-4-6)
- [x] 3.3 — Update .env.example with GROQ_API_KEY, ANTHROPIC_API_KEY (claude-haiku-4-5)

### Files Modified
- `api/chat.py` — Added: GROQ_TRIGGER_CODES, OPENROUTER_SKIP_CODES, ANTHROPIC_TRIGGER_CODES, FREE_MODELS (module-level), _anthropic_tools(), _parse_anthropic_choice(), _log_fail(). Replaced do_POST provider logic with 3-provider waterfall
- `.env.example` — Added GROQ_API_KEY and ANTHROPIC_API_KEY

### Fallback Order
1. Groq llama-3.1-8b-instant — 5s timeout, GROQ_API_KEY required
2. OpenRouter free model loop — 30s, OPENROUTER_API_KEY required
3. Anthropic claude-haiku-3-5-20251001 — 30s, ANTHROPIC_API_KEY required
4. All fail → "I'm having a little trouble connecting..." friendly message

### Env Vars to Add
GROQ_API_KEY, ANTHROPIC_API_KEY (OPENROUTER_API_KEY already existed)

### Verification
- No build step needed — Python only, logic change

---

## Priority 4 — TTS Fix — 2026-05-23

### Tasks Completed
- [x] 4.1 — Add audioCtx state variable (claude-haiku-4-5)
- [x] 4.2 — Add res.ok check before res.blob() (claude-haiku-4-5)
- [x] 4.3 — Add AudioContext.resume() before audio.play() (claude-haiku-4-5)
- [x] 4.4 — Fix outer catch to call startListening() — root cause fix (claude-sonnet-4-6)
- [x] 4.5 — Add AudioContext creation in onFirstClick handler (claude-haiku-4-5)

### Root Cause
When /api/tts fetch throws (network error, timeout), the outer catch block ran cleanup but did NOT call startListening(). Conversation loop broke — widget showed text but no more audio, no auto-restart.

### Files Modified
- `public/voice-widget.js` — 5 targeted edits:
  1. let audioCtx = null added to state
  2. if (!res.ok) throw before res.blob() 
  3. audioCtx.resume() before audio.play()
  4. Outer catch: added processingUtterance=false, intentionalStop=false, setTimeout(startListening,400) if conversationActive
  5. onFirstClick: AudioContext creation for audio unlock

### Verification
- No build step — static JS change

---

## Priority 5 — Date Input — 2026-05-23

### Tasks Completed
- [x] 5.1 — Update tool description for preferred_date/time in api/chat.py (claude-haiku-4-5)
- [x] 5.2 — Change booking-form.tsx date/time inputs to type="text" (claude-haiku-4-5)

### Files Modified
- `api/chat.py` — preferred_date description: "YYYY-MM-DD format — for Supabase storage only, never show this format to the user"; same for preferred_time
- `src/components/sections/booking-form.tsx` — date: type="date" → type="text" placeholder "e.g. May 8 or next Monday"; time: type="time" → type="text" placeholder "e.g. 2pm or afternoon"; removed min= calculation

### Verification
- No build step for chat.py; booking-form.tsx is a Next.js component, verified clean change

---

## Priority 6 — Mobile UI — 2026-05-23

### Tasks Completed
- [x] 6.1 — Float button: pill shape, label text, shadow, branded color (claude-sonnet-4-6)
- [x] 6.2 — Chat widget mobile: full-screen overlay + slide-up animation (claude-sonnet-4-6)
- [x] 6.3 — Scroll: -webkit-overflow-scrolling touch + mobile flex (claude-haiku-4-5)
- [x] 6.4 — visualViewport keyboard detection (claude-haiku-4-5)

### Files Modified
- `public/voice-widget.js` — CSS block changes:
  - #aria-float-btn: pill (height 52px, width auto, padding, border-radius 26px, label text, shadow)
  - .aria-transcript: -webkit-overflow-scrolling: touch added
  - Added @keyframes aria-slide-up
  - Added @media (max-width: 640px): widget full-screen (100vw × 100dvh), transcript flex:1, slide-up animation, safe-area padding
  - HTML: float button gets <span id="aria-float-label">Chat with Aria</span>
  - init(): visualViewport resize listener for keyboard height detection

### Verification
- Static JS change — no build step needed

---

## Priority 2 — Booking Flow Gate — 2026-05-23

### Tasks Completed
- [x] 2.1 — Add CONFIRMATION_WORDS + _user_confirmed() + booking gate in api/chat.py (claude-sonnet-4-6)
- [x] 2.2 — Update system prompt BOOKING FLOW to explicit 4-step sequence (claude-haiku-4-5)

### Files Modified
- `api/chat.py` — 3 changes:
  1. Added CONFIRMATION_WORDS set and _user_confirmed() helper (lines 10-23)
  2. Rewrote BOOKING FLOW section in system prompt to explicit STEP 1-4 with CRITICAL gate rule
  3. Added server-side booking gate in tool_calls handler — rejects tool execution if last user message is not a confirmation, returns confirmation summary instead

### How the gate works
- LLM calls book_appointment tool (possibly too early)
- Code checks _user_confirmed(messages): scans last user message for explicit confirmation words
- If NOT confirmed → returns confirmation summary as text, returns early — ZERO Supabase writes
- If confirmed → proceeds with existing booking logic (duplicate check, then insert)
- Defense in depth: system prompt says "CRITICAL: NEVER call book_appointment before Step 3 + yes"
  AND code gate prevents execution even if LLM ignores the prompt

### Verification
- No build step needed — Python only, no DB touched

---
