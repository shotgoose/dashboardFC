# simple local http and websocket server
import asyncio, json, threading
import websockets
import sys
import os
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial

# import data fetch function from interpreter
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)

interpreter_dir = os.path.join(parent_dir, "data_collector")
interpreter_path = os.path.join(interpreter_dir, "data_collector.py")

if interpreter_dir not in sys.path:
    sys.path.append(interpreter_dir)

import data_collector

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

def start_http():
    handler = partial(NoCacheHandler, directory="ui")
    server = ThreadingHTTPServer(("0.0.0.0", 8000), handler)
    print("HTTP on http://localhost:8000 (serving ./ui, no-cache)")
    server.serve_forever()

CLIENTS = set()

# WebSocket Handler
async def ws_handler(ws, path=None):
    CLIENTS.add(ws)
    try:
        #consume messages safely
        async for _ in ws:  # consume messages safely
            pass
    except Exception as e:
        #print error but avoid crash
        print("WS handler error:", repr(e))
    finally:
        CLIENTS.discard(ws)


# broadcast loop
async def broadcaster():
    while True:
        try:
            data = data_collector.collect()
            if CLIENTS:
                msg = json.dumps(data)
                dead = []
                send_tasks = [c.send(msg) for c in list(CLIENTS) if getattr(c, "open", True)]
                # send concurrently and filter failures
                results = await asyncio.gather(*send_tasks, return_exceptions=True)
                for c, r in zip(list(CLIENTS), results):
                    if isinstance(r, Exception):
                        dead.append(c)
                for c in dead:
                    CLIENTS.discard(c)
            await asyncio.sleep(1/120)  # 120 Hz
        except Exception as e:
            # lot but keep loop alive
            print("Broadcast error:", repr(e))
            await asyncio.sleep(1/120)

async def main():
    # HTTP server in a background thread
    threading.Thread(target=start_http, daemon=True).start()

    # WebSocket server with ping interval
    server = websockets.serve(ws_handler, "0.0.0.0", 8765, ping_interval=20, ping_timeout=20)
    async with server:
        print("WebSocket running on ws://0.0.0.0:8765")
        await broadcaster()

if __name__ == "__main__":
    asyncio.run(main())
