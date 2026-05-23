import json
import os
import re
import time
import traceback
from datetime import datetime, timedelta
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
    "- If the user is just exploring: answer their questions helpfully, no pressure.\n"
    "- Availability or hours questions ('when are you open', 'are you available', 'what times', 'do you have openings'): answer with business hours (Mon–Sat 9AM–6PM) as plain text only — NEVER call book_appointment for these.\n\n"
    "BOOKING FLOW — follow these steps IN ORDER (only activate when user explicitly asks to book):\n"
    "STEP 1 — Collect conversationally, one question at a time:\n"
    "  → Full name\n"
    "  → Phone number\n"
    "  → Service needed\n"
    "  → Address\n"
    "  → Preferred date (ask naturally, e.g. 'What date works best for you?')\n"
    "  → Preferred time (ask e.g. 'What time works best for you?') — MUST be a real time like 10 AM or 2 PM, never TBD or 'to be confirmed'\n"
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
    "meta-llama/llama-3.1-8b-instruct:free",
    "meta-llama/llama-3.2-3b-instruct:free",
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


def _normalize_date(date_str):
    """Convert natural-language date to YYYY-MM-DD. Returns None if unparseable."""
    if not date_str:
        return None
    s = date_str.strip()
    if re.match(r'^\d{4}-\d{2}-\d{2}$', s):
        return s
    lower = s.lower()
    if 'today' in lower:
        return datetime.now().strftime('%Y-%m-%d')
    if 'tomorrow' in lower:
        return (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
    day_names = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    for i, day in enumerate(day_names):
        if day in lower:
            today = datetime.now()
            ahead = i - today.weekday()
            if ahead <= 0:
                ahead += 7
            return (today + timedelta(days=ahead)).strftime('%Y-%m-%d')
    for fmt in ('%B %d', '%b %d', '%m/%d', '%B %d %Y', '%b %d %Y', '%m/%d/%Y'):
        try:
            parsed = datetime.strptime(s, fmt)
            if parsed.year == 1900:
                parsed = parsed.replace(year=datetime.now().year)
            return parsed.strftime('%Y-%m-%d')
        except ValueError:
            pass
    return None


def _normalize_time(time_str):
    """Convert natural-language time to HH:MM:SS. Returns None if unparseable."""
    if not time_str:
        return None
    s = time_str.strip()
    if re.match(r'^\d{2}:\d{2}:\d{2}$', s):
        return s
    if re.match(r'^\d{1,2}:\d{2}$', s):
        h, m = s.split(':')
        return f"{int(h):02d}:{m}:00"
    for fmt in ('%I %p', '%I:%M %p', '%H:%M', '%I%p', '%I:%M%p'):
        try:
            parsed = datetime.strptime(s.upper(), fmt)
            return parsed.strftime('%H:%M:%S')
        except ValueError:
            pass
    lower = s.lower()
    if 'afternoon' in lower:
        return '14:00:00'
    if 'morning' in lower:
        return '09:00:00'
    if 'evening' in lower:
        return '18:00:00'
    if 'noon' in lower or 'midday' in lower:
        return '12:00:00'
    return None


def _is_valid_uuid(s):
    """Return True only if s looks like a real UUID (not a placeholder string)."""
    return bool(s and re.match(
        r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', s, re.I
    ))


def _extract_leaked_tool_call(content):
    """Robust parser for <function=name>{...} that llama models leak.
    Uses brace-counting so it works with or without a closing </function> tag.
    Returns (tool_calls_list, clean_text) or (None, original_content)."""
    if not content:
        return None, content

    open_match = re.search(r'<function=(\w+)>', content)
    if not open_match:
        return None, content

    func_name = open_match.group(1)
    rest = content[open_match.end():]

    brace_start = rest.find('{')
    if brace_start == -1:
        return None, content

    depth = 0
    brace_end = -1
    for i, ch in enumerate(rest):
        if i < brace_start:
            continue
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                brace_end = i + 1
                break

    raw_json = rest[brace_start:brace_end] if brace_end != -1 else rest[brace_start:]
    try:
        args_dict = json.loads(raw_json)
        tool_calls = [{'function': {'name': func_name, 'arguments': json.dumps(args_dict)}}]
        suffix = rest[brace_end:] if brace_end != -1 else ''
        suffix = re.sub(r'^\s*</function>\s*', '', suffix).strip()
        clean = (content[:open_match.start()] + (' ' + suffix if suffix else '')).strip()
        return tool_calls, clean
    except (json.JSONDecodeError, ValueError):
        return None, content


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

            # Some llama/free models leak function calls as text instead of structured tool_calls
            if choice and not choice.get('tool_calls') and choice.get('content'):
                leaked, clean = _extract_leaked_tool_call(choice.get('content', ''))
                if leaked:
                    choice = {'content': clean, 'tool_calls': leaked}

            tool_calls = choice.get('tool_calls')

            if tool_calls:
                try:
                    args = json.loads(tool_calls[0]['function']['arguments'])
                except (json.JSONDecodeError, KeyError, IndexError):
                    self._send_json(200, {"text": "I'm here to help! What would you like to know?"})
                    return

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

                # Save natural-language values for user-facing messages
                original_date = args.get('preferred_date', '')
                original_time = args.get('preferred_time', '')

                # Normalize to Supabase date/time formats
                norm_date = _normalize_date(original_date)
                norm_time = _normalize_time(original_time)
                if not norm_date or not norm_time:
                    self._send_json(200, {
                        "text": "I need a specific date and time to complete the booking. "
                                "Could you tell me the exact date and preferred time?"
                    })
                    return

                # Look up service_id by name — LLM never knows the UUID and sometimes sends
                # placeholder text like "highlights service ID" instead of a real UUID
                service_id = args.get('service_id') if _is_valid_uuid(args.get('service_id')) else None
                if not service_id and args.get('service_name'):
                    svc_name = args['service_name']
                    # Try full name first, then word-by-word fallback
                    svc_lookup = supabase.table('services').select('id').ilike(
                        'name', f"%{svc_name}%"
                    ).eq('is_active', True).limit(1).execute()
                    if svc_lookup.data:
                        service_id = svc_lookup.data[0]['id']
                    else:
                        for word in svc_name.split():
                            if len(word) > 3:
                                svc_lookup2 = supabase.table('services').select('id').ilike(
                                    'name', f"%{word}%"
                                ).eq('is_active', True).limit(1).execute()
                                if svc_lookup2.data:
                                    service_id = svc_lookup2.data[0]['id']
                                    break

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
                    "service_id": service_id,
                    "service_name": args['service_name'],
                    "preferred_date": norm_date,
                    "preferred_time": norm_time,
                    "status": "pending",
                }
                if args.get('client_email'):
                    booking_row['client_email'] = args['client_email']
                # Store address in notes if no explicit notes provided
                if args.get('notes'):
                    booking_row['notes'] = args['notes']
                elif args.get('address'):
                    booking_row['notes'] = f"Address: {args['address']}"

                supabase.table('bookings').insert(booking_row).execute()

                text = (
                    f"Perfect! I've booked your {args['service_name']} on "
                    f"{original_date} at {original_time}. "
                    "We'll see you then! Is there anything else I can help you with?"
                )
                self._send_json(200, {"text": text, "booked": True})
                return

            content = (choice.get('content') or '').strip()
            if not content:
                content = "I'm here to help! Could you tell me a bit more about what you're looking for?"
            self._send_json(200, {"text": content})

        except Exception as e:
            tb = traceback.format_exc()
            print(f"[chat] ERROR: {e}\n{tb}")
            self._send_json(500, {"error": str(e), "traceback": tb})
