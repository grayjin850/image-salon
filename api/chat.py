import json
import os
import time
import traceback
from http.server import BaseHTTPRequestHandler
import httpx
from supabase import create_client


SYSTEM_PROMPT_TEMPLATE = (
    "You are Aria, a warm and professional AI reservation specialist for an image salon. "
    "You speak naturally and conversationally, like a real receptionist.\n\n"
    "SALON SERVICES & PRICING:\n"
    "{rag_block}\n\n"
    "BOOKING RULES:\n"
    "- Collect: full name, phone number, preferred date, preferred time, service name\n"
    "- Ask one question at a time — never dump a form on the customer\n"
    "- Confirm all details before booking\n"
    "- Once confirmed, call the book_appointment function\n"
    "- Business hours: Monday-Saturday 9AM-7PM\n"
    "- Same-day bookings allowed if time slot is available\n\n"
    "PERSONALITY:\n"
    "- Warm, elegant, concise — max 2 sentences per response\n"
    "- If asked about services not in the list, say \"Let me check on that for you\"\n"
    "- Always greet first-time visitors: \"Hello! I'm Aria, your salon concierge. How can I help you today?\""
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
                "preferred_date": {"type": "string", "description": "YYYY-MM-DD format"},
                "preferred_time": {"type": "string", "description": "HH:MM:SS format"},
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
            openrouter_key = os.environ.get('OPENROUTER_API_KEY')
            supabase_url = os.environ.get('SUPABASE_URL') or os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
            supabase_key = os.environ.get('SUPABASE_SERVICE_KEY') or os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
            site_url = os.environ.get('SITE_URL', '')

            print(f"[chat] OPENROUTER_API_KEY set: {bool(openrouter_key)}")
            print(f"[chat] SUPABASE_URL set: {bool(supabase_url)}")
            print(f"[chat] SUPABASE_KEY set: {bool(supabase_key)}")
            if not openrouter_key:
                self._send_json(500, {"error": "OPENROUTER_API_KEY is not set in environment"})
                return

            content_length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(content_length))
            messages = body.get('messages', [])

            supabase = create_client(supabase_url, supabase_key)
            rag_block = _build_rag_block(supabase)
            system_prompt = SYSTEM_PROMPT_TEMPLATE.replace('{rag_block}', rag_block)

            FREE_MODELS = [
                "meta-llama/llama-3.3-70b-instruct:free",
                "deepseek/deepseek-chat-v3-0324:free",
                "google/gemma-3-27b-it:free",
                "mistralai/mistral-small-3.1-24b-instruct:free",
                "qwen/qwen3-8b:free",
            ]

            payload = {
                "model": FREE_MODELS[0],
                "messages": [{"role": "system", "content": system_prompt}] + messages,
                "tools": TOOLS,
                "tool_choice": "auto",
                "max_tokens": 200,
            }
            headers = {
                "Authorization": f"Bearer {openrouter_key}",
                "HTTP-Referer": "https://image-salon-three.vercel.app",
                "X-Title": "Image Salon Aria",
                "Content-Type": "application/json",
            }

            with httpx.Client(timeout=30.0) as client:
                response = None
                failed_models = []
                for model_id in FREE_MODELS:
                    payload["model"] = model_id
                    print(f"[chat] trying model: {model_id}")
                    response = client.post(
                        "https://openrouter.ai/api/v1/chat/completions",
                        headers=headers,
                        json=payload,
                    )
                    if response.status_code not in (429, 404):
                        print(f"[chat] success with model: {model_id} status={response.status_code}")
                        break
                    err_body = response.text[:200]
                    failed_models.append(f"{model_id}={response.status_code}:{err_body}")
                    print(f"[chat] model {model_id} returned {response.status_code}: {err_body}")
                    time.sleep(1)

                if response.status_code in (429, 404):
                    self._send_json(200, {"text": "I'm a little busy right now — please try again in a moment!", "debug": failed_models})
                    return
                response.raise_for_status()
                data = response.json()

            choice = data['choices'][0]['message']
            tool_calls = choice.get('tool_calls')

            if tool_calls:
                args = json.loads(tool_calls[0]['function']['arguments'])

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
