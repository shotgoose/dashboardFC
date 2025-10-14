# server.py
import asyncio, json, random, time, threading
import websockets
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

# serve ./dashboard (contains index.html etc.)
def start_http():
    server = ThreadingHTTPServer(('0.0.0.0', 8000), SimpleHTTPRequestHandler)
    print("HTTP server running on http://0.0.0.0:8000")
    server.serve_forever()

# fake sensor read
def read_sensors():
    return {
        "rpm": 0,
        "mph": 0,
        "coolant_temp": 0,
        "oil_pressure": 0,
        "voltage": 0,
        "fuel_level": 0,
        "outside_temp": 0,
        "mpg": 0,
        "odometer": 0,
        "trip": 0,
        "range": 0,
        "runtime": 0, # time engine has been on in seconds
        "illumination": False,
        "right_turn_signal": False,
        "left_turn_signal": False,
        "hazards": False,
        "high_beam": False, 
    }

CLIENTS = set()

async def ws_handler(ws):
    CLIENTS.add(ws)
    try:
        async for msg in ws:
            pass  # ignore incoming messages for now
    finally:
        CLIENTS.discard(ws)

async def broadcaster():
    while True:
        data = {"type": "car_update", "car": read_sensors()}
        if CLIENTS:
            msg = json.dumps(data)
            await asyncio.gather(*[c.send(msg) for c in list(CLIENTS) if c.open], return_exceptions=True)
        await asyncio.sleep(0.05)  # 20 Hz

async def main():
    # start HTTP server in background thread
    threading.Thread(target=start_http, daemon=True).start()
    # start websocket server
    async with websockets.serve(ws_handler, "0.0.0.0", 8765):
        print("WebSocket running on ws://0.0.0.0:8765")
        await broadcaster()

if __name__ == "__main__":
    asyncio.run(main())
