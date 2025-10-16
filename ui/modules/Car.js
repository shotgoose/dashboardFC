// declare car 
const car = {
    // car data values
    rpm: 0,
    mph: 0,
    coolant_temp: 0,
    oil_pressure: 0,
    voltage: 0,
    fuel_level: 0,
    outside_temp: 0,
    mpg: 0,
    odometer: 0,
    trip: 0,
    range: 0,
    runtime: 0, // time engine has been on in seconds
    illumination: false,
    right_turn_signal: false,
    left_turn_signal: false,
    hazards: false,
    high_beam: false, 

    // reference values
    max_rpm: 8000,
    max_mph: 120,
    max_safe_rpm: 6800,
    min_coolant_temp: 82.2, //adjust
    max_coolant_temp: 98.8, //adjust
    min_oil_pressure: 20, //adjust
    max_oil_pressure: 60, //adjust
    min_voltage_on: 13.5, //adjust if needed
    min_voltage_off: 12.4, //adjust if needed
    expected_mpg: 14, //adjust if needed
    fuel_warn_level: 20,
    max_cold_revs: 3500, //adjust if needed
    max_warming_time: 300, //adjust if needed
}

window.car = car;

function makeWsUrl() {
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    const host = location.hostname; // e.g., 'localhost'
    const port = 8765;              // WS server port
    return `${proto}://${host}:${port}`;
}

// connection
let ws = null;
let reconnectTimer = null;
let reconnectAttempts = 0;
let shouldReconnect = true; // set to false if you intentionally call close()

const MIN_DELAY = 500;      // ms
const MAX_DELAY = 10000;    // ms

function backoffDelay() {
  // exponential backoff with jitter
  const base = Math.min(MAX_DELAY, MIN_DELAY * 2 ** reconnectAttempts);
  const jitter = Math.random() * 0.3 * base; // up to +30% jitter
  return Math.floor(base + jitter);
}

function connect() {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    // Already connected or in progress
    return ws;
  }
  if (reconnectTimer) {
    // A reconnect is already scheduled
    return ws;
  }

  const url = makeWsUrl();
  console.log('Connecting to', url);
  ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("Connected to car data server");
    reconnectAttempts = 0; // reset backoff
  };

  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "car_update" && message.car) {
        Object.assign(car, message.car);
      }
    } catch (err) {
      console.error("Invalid JSON");
    }
  };

  ws.onerror = (err) => {
    // Log only; avoid explicit close() here to prevent double-close loops.
    console.error("WebSocket error:", err);
  };

  ws.onclose = (evt) => {
    console.warn(`WebSocket closed (code=${evt.code}, wasClean=${evt.wasClean}).`);
    if (!shouldReconnect) return;

    // Only schedule one reconnect
    if (!reconnectTimer) {
      reconnectAttempts++;
      const delay = backoffDelay();
      console.warn(`Reconnecting in ${delay}ms...`);
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, delay);
    }
  };

  return ws;
}

function disconnect() {
  shouldReconnect = false;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    ws.close(1000, "Client closing");
  }
  ws = null;
}

function isConnected() {
  return ws && ws.readyState === WebSocket.OPEN;
}

// function to set car variable - should be used only for testing
function set(variable, value) {
    if (!car.hasOwnProperty(variable)) {
        console.warn("Variable does not exist");
        return;
    }
    
    if (typeof value !== typeof car[variable]) {
        console.warn("Variable type mismatch");
        return;
    }

    car[variable] = value;
}

// function to fetch read only car data
function fetch() {
    return new Proxy(car, {
        set() {
            throw new Error("Cannot modify read-only car data");
        },
        deleteProperty() {
            throw new Error("Cannot delete properties on read-only car data");
        },
        defineProperty() {
            throw new Error("Cannot define new properties on read-only car data");
        }
    });
}

export const Car = { connect, disconnect, isConnected, set, fetch };