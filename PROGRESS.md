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
