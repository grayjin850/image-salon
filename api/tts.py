from http.server import BaseHTTPRequestHandler
import json
import io
import asyncio
import edge_tts

VOICE = 'en-US-JennyNeural'


async def _synthesize(text: str) -> bytes:
    buf = io.BytesIO()
    communicate = edge_tts.Communicate(text, VOICE)
    async for chunk in communicate.stream():
        if chunk['type'] == 'audio':
            buf.write(chunk['data'])
    return buf.getvalue()


class handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            data = json.loads(body)
            text = data.get('text', '').strip()

            if not text:
                error = json.dumps({'error': 'text is required'}).encode()
                self.send_response(400)
                self._cors()
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(error)))
                self.end_headers()
                self.wfile.write(error)
                return

            audio = asyncio.run(_synthesize(text))
            if not audio:
                raise ValueError("TTS synthesis returned empty audio")

            self.send_response(200)
            self._cors()
            self.send_header('Content-Type', 'audio/mpeg')
            self.send_header('Content-Length', str(len(audio)))
            self.end_headers()
            self.wfile.write(audio)

        except Exception as e:
            error = json.dumps({'error': str(e)}).encode()
            self.send_response(500)
            self._cors()
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(error)))
            self.end_headers()
            self.wfile.write(error)
