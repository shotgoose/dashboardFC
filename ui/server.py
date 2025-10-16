# simple local http and websocket server
import asyncio, json, threading
import websockets
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial

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
async def ws_handler(ws, path=None):  # <-- compatible with both APIs
    CLIENTS.add(ws)
    try:
        async for _ in ws:  # consume messages safely
            pass
    except Exception as e:
        print("WS handler error:", repr(e))  # don't crash the process
    finally:
        CLIENTS.discard(ws)


# Broadcast loop, avoid crashes at all costs
async def broadcaster():
    while True:
        try:
            data = {
                "type": "car_update",
                "car": {
                    "rpm": 2123, "mph": 50, "coolant_temp": 0, "oil_pressure": 0,
                    "voltage": 13.4, "fuel_level": 45, "outside_temp": 0, "mpg": 0,
                    "odometer": 0, "trip": 0, "range": 0, "runtime": 0,
                    "illumination": False, "right_turn_signal": False,
                    "left_turn_signal": True, "hazards": False, "high_beam": True,
                }
            }
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
            await asyncio.sleep(1/60)  # 60 Hz
        except Exception as e:
            # Log but keep the loop alive
            print("Broadcast error:", repr(e))
            await asyncio.sleep(1/60)

async def main():
    # HTTP server in a background thread
    threading.Thread(target=start_http, daemon=True).start()

    # WebSocket server (set a ping interval to keep connections healthy)
    server = websockets.serve(ws_handler, "0.0.0.0", 8765, ping_interval=20, ping_timeout=20)
    async with server:
        print("WebSocket running on ws://0.0.0.0:8765")
        await broadcaster()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
