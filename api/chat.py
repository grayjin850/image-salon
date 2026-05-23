import json
import os
import time
import traceback
from http.server import BaseHTTPRequestHandler
import httpx
from supabase import create_client


CONFIRMATION_WORDS = {
    'yes', 'yep', 'yeah', 'yup', 'ok', 'okay', 'sure', 'definitely',
    'confirmed', 'correct', 'go ahead', 'book it', "let's do it",
    'please book', 'do it', 'sounds good', 'perfect',
}


def _user_confirmed(messages):
    """Return True only if the most recent user message is an explicit confirmation."""
    for msg in reversed(messages):
        if msg.get('role') == 'user':
            text = msg.get('content', '').lower().strip().rstrip('!.,?')
            return any(phrase in text for phrase in CONFIRMATION_WORDS)
    return False


SYSTEM_PROMPT_TEMPLATE = (
    "You are Aria, a warm and professional AI concierge for Image Salon. "
    "You speak naturally and conversationally, like a real receptionist.\n\n"
    "OPENING GREETING (only when the conversation has no prior messages):\n"
    "Say exactly: \"Hi! I'm Aria. I'm here to help you. Would you like to book an appointment with us, "
    "or explore our website first? Feel free to hide me anytime — just click the X above!\"\n\n"
    "SALON SERVICES & PRICING:\n"
    "{rag_block}\n\n"
    "CONVERSATION RULES:\n"
    "- NEVER assume the user wants to book. They may just be exploring.\n"
    "- If the user asks about pricing, services, availability, or hours: answer fully first, no booking push.\n"
    "- Only start the booking flow when the user uses a booking trigger word: "
    "book, reserve, schedule, appointment, yes I want to book, let's do it.\n"
    "- If the user is just exploring: answer their questions helpfully, no pressure.\n\n"
    "BOOKING FLOW — follow these steps IN ORDER (only activate when user explicitly asks to book):\n"
    "STEP 1 — Collect conversationally, one question at a time:\n"
    "  → Full name\n"
    "  → Phone number\n"
    "  → Service needed\n"
    "  → Address\n"
    "  → Preferred date (ask naturally, e.g. 'What date works best for you?')\n"
    "STEP 2 — After all info collected, present availability:\n"
    "  → Say: 'I have [date] available for [service]. Does that work for you?'\n"
    "STEP 3 — Show this exact confirmation summary (do NOT call book_appointment yet):\n"
    "  'Just to confirm:\n"
    "   Name: [name]\n"
    "   Phone: [phone]\n"
    "   Service: [service]\n"
    "   Address: [address]\n"
    "   Date & Time: [natural language date and time]\n\n"
    "   Shall I go ahead and book this for you?'\n"
    "STEP 4 — ONLY call book_appointment AFTER user says: yes, confirm, go ahead, book it, or that's correct\n"
    "CRITICAL: NEVER call book_appointment before completing Step 3 and receiving explicit yes.\n"
    "- Business hours: Monday-Saturday 9AM-6PM\n"
    "- Same-day bookings allowed if time slot is available\n\n"
    "PERSONALITY:\n"
    "- Warm, elegant, concise — max 2 sentences per response\n"
    "- If asked about services not in the list, say \"Let me check on that for you\"\n"
    "- Never show dates in YYYY-MM-DD format to the user — always use natural language\n"
    "- Never expose technical errors or database terms to the user"
)


TOOLS = [{
    "type": "function",
    "function": {
        "name": "book_appointment",
        "description": "Book a salon appointment after collecting all required info from customer",
        "parameters": {
            "type": "object",
            "properties": {
                "client_name": {"type": "string"},
                "client_phone": {"type": "string"},
                "client_email": {"type": "string", "description": "optional, ask only if offered"},
                "service_id": {"type": "string", "description": "UUID from services table"},
                "service_name": {"type": "string"},
                "preferred_date": {"type": "string", "description": "YYYY-MM-DD format — for Supabase storage only, never show this format to the user"},
                "preferred_time": {"type": "string", "description": "HH:MM:SS format — for Supabase storage only, always confirm time in natural language first"},
                "notes": {"type": "string", "description": "any additional requests"}
            },
            "required": ["client_name", "client_phone", "service_id", "service_name", "preferred_date", "preferred_time"]
        }
    }
}]


def _build_rag_block(supabase):
    result = supabase.table('services').select(
        'id, category, name, description, price_label'
    ).eq('is_active', True).order('category').order('sort_order').execute()

    rows = result.data or []
    grouped = {}
    order = []
    for row in rows:
        category = row.get('category') or 'Other'
        if category not in grouped:
            grouped[category] = []
            order.append(category)
        grouped[category].append(row)

    lines = []
    for category in order:
        lines.append(f"{category}:")
        for svc in grouped[category]:
            name = svc.get('name', '')
            price = svc.get('price_label', '')
            description = svc.get('description', '')
            parts = [name]
            if price:
                parts.append(price)
            if description:
                parts.append(description)
            lines.append("  • " + " — ".join(parts))
    return "\n".join(lines)


GROQ_TRIGGER_CODES = {429, 500, 503}
OPENROUTER_SKIP_CODES = {402, 404, 429}
ANTHROPIC_TRIGGER_CODES = {429, 500, 503}
FREE_MODELS = [
    "openai/gpt-oss-20b:free",
    "deepseek/deepseek-v4-flash:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "google/gemma-4-31b-it:free",
]


def _anthropic_tools(openai_tools):
    result = []
    for t in openai_tools:
        f = t['function']
        result.append({"name": f['name'], "description": f['description'], "input_schema": f['parameters']})
    return result


def _parse_anthropic_choice(data):
    content = data.get('content', [])
    text = ' '.join(c.get('text', '') for c in content if c.get('type') == 'text').strip()
    tool_use = next((c for c in content if c.get('type') == 'tool_use'), None)
    if tool_use:
        return {
            'content': text,
            'tool_calls': [{'function': {'name': tool_use['name'], 'arguments': json.dumps(tool_use['input'])}}]
        }
    return {'content': text, 'tool_calls': None}


def _log_fail(provider, reason):
    ts = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    print(f"[chat] [{ts}] provider={provider} reason={reason}")


class handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def _send_json(self, status, data):
        payload = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(payload)))
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_POST(self):
        try:
            groq_key = os.environ.get('GROQ_API_KEY')
            openrouter_key = os.environ.get('OPENROUTER_API_KEY')
            anthropic_key = os.environ.get('ANTHROPIC_API_KEY')
            supabase_url = os.environ.get('SUPABASE_URL') or os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
            supabase_key = os.environ.get('SUPABASE_SERVICE_KEY') or os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

            content_length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(content_length))
            messages = body.get('messages', [])

            supabase = create_client(supabase_url, supabase_key)
            rag_block = _build_rag_block(supabase)
            system_prompt = SYSTEM_PROMPT_TEMPLATE.replace('{rag_block}', rag_block)

            full_messages = [{"role": "system", "content": system_prompt}] + messages
            choice = None

            # ── PRIMARY: Groq (5s timeout) ────────────────────────────
            if groq_key and choice is None:
                try:
                    with httpx.Client(timeout=5.0) as client:
                        r = client.post(
                            "https://api.groq.com/openai/v1/chat/completions",
                            headers={"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"},
                            json={
                                "model": "llama-3.1-8b-instant",
                                "messages": full_messages,
                                "tools": TOOLS,
                                "tool_choice": "auto",
                                "max_tokens": 200,
                            },
                        )
                    if r.status_code not in GROQ_TRIGGER_CODES:
                        r.raise_for_status()
                        choice = r.json()['choices'][0]['message']
                    else:
                        _log_fail('groq', f'HTTP {r.status_code}')
                except httpx.TimeoutException:
                    _log_fail('groq', 'timeout >5s')
                except Exception as e:
                    _log_fail('groq', str(e))

            # ── FALLBACK 1: OpenRouter (free model loop) ───────────────
            if openrouter_key and choice is None:
                try:
                    or_headers = {
                        "Authorization": f"Bearer {openrouter_key}",
                        "HTTP-Referer": "https://image-salon-three.vercel.app",
                        "X-Title": "Image Salon Aria",
                        "Content-Type": "application/json",
                    }
                    with httpx.Client(timeout=30.0) as client:
                        for model_id in FREE_MODELS:
                            r = client.post(
                                "https://openrouter.ai/api/v1/chat/completions",
                                headers=or_headers,
                                json={
                                    "model": model_id,
                                    "messages": full_messages,
                                    "tools": TOOLS,
                                    "tool_choice": "auto",
                                    "max_tokens": 200,
                                },
                            )
                            if r.status_code not in OPENROUTER_SKIP_CODES:
                                r.raise_for_status()
                                choice = r.json()['choices'][0]['message']
                                break
                            _log_fail(f'openrouter/{model_id}', f'HTTP {r.status_code}')
                            time.sleep(1)
                except Exception as e:
                    _log_fail('openrouter', str(e))

            # ── FALLBACK 2: Anthropic ──────────────────────────────────
            if anthropic_key and choice is None:
                try:
                    with httpx.Client(timeout=30.0) as client:
                        r = client.post(
                            "https://api.anthropic.com/v1/messages",
                            headers={
                                "x-api-key": anthropic_key,
                                "anthropic-version": "2023-06-01",
                                "Content-Type": "application/json",
                            },
                            json={
                                "model": "claude-haiku-3-5-20251001",
                                "max_tokens": 200,
                                "system": system_prompt,
                                "messages": messages,
                                "tools": _anthropic_tools(TOOLS),
                            },
                        )
                    if r.status_code not in ANTHROPIC_TRIGGER_CODES:
                        r.raise_for_status()
                        choice = _parse_anthropic_choice(r.json())
                    else:
                        _log_fail('anthropic', f'HTTP {r.status_code}')
                except Exception as e:
                    _log_fail('anthropic', str(e))

            # ── All providers failed ───────────────────────────────────
            if choice is None:
                self._send_json(200, {
                    "text": "I'm having a little trouble connecting right now. Please try again in a moment!"
                })
                return

            tool_calls = choice.get('tool_calls')

            if tool_calls:
                args = json.loads(tool_calls[0]['function']['arguments'])

                # BOOKING GATE: never write to Supabase without explicit user confirmation
                if not _user_confirmed(messages):
                    time_str = args.get('preferred_time', '')
                    display_time = time_str[:5] if len(time_str) >= 5 else time_str
                    confirm_text = (
                        "Just to confirm:\n"
                        f"Name: {args.get('client_name', '')}\n"
                        f"Phone: {args.get('client_phone', '')}\n"
                        f"Service: {args.get('service_name', '')}\n"
                        f"Date & Time: {args.get('preferred_date', '')} at {display_time}\n\n"
                        "Shall I go ahead and book this for you?"
                    )
                    self._send_json(200, {"text": confirm_text, "booked": False})
                    return

                existing = supabase.table('bookings').select('id').eq(
                    'client_name', args['client_name']
                ).eq('service_name', args['service_name']).execute()

                if existing.data:
                    apology = (
                        f"I'm so sorry, it looks like we already have a "
                        f"{args['service_name']} appointment on file for {args['client_name']}. "
                        "Would you like to book a different service instead?"
                    )
                    self._send_json(200, {"text": apology, "booked": False})
                    return

                booking_row = {
                    "client_name": args['client_name'],
                    "client_phone": args['client_phone'],
                    "service_id": args['service_id'],
                    "service_name": args['service_name'],
                    "preferred_date": args['preferred_date'],
                    "preferred_time": args['preferred_time'],
                    "status": "pending",
                }
                if args.get('client_email'):
                    booking_row['client_email'] = args['client_email']
                if args.get('notes'):
                    booking_row['notes'] = args['notes']

                supabase.table('bookings').insert(booking_row).execute()

                time_str = args['preferred_time']
                display_time = time_str[:5] if len(time_str) >= 5 else time_str

                text = (
                    f"Perfect! I've booked your {args['service_name']} on "
                    f"{args['preferred_date']} at {display_time}. "
                    "We'll see you then! Is there anything else I can help you with?"
                )
                self._send_json(200, {"text": text, "booked": True})
                return

            self._send_json(200, {"text": choice.get('content', '')})

        except Exception as e:
            tb = traceback.format_exc()
            print(f"[chat] ERROR: {e}\n{tb}")
            self._send_json(500, {"error": str(e), "traceback": tb})
