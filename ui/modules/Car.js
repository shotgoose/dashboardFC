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

function makeWsUrl() {
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    const host = location.hostname; // e.g., 'localhost'
    const port = 8765;              // WS server port
    return `${proto}://${host}:${port}`;
}

// pull car data
function connect() {
    const url = makeWsUrl();
    console.log('Connecting to', url);
    const ws = new WebSocket(url);

    ws.onopen = () => {
        console.log("Connected to car data server")
    }

    ws.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);

            if (message.type === "car_update" && message.car) {
                Object.assign(car, message.car);
            }
        }
        catch (err) {
            console.error("Invalid JSON")
        }
    }

    ws.onclose = () => {
        console.warn("WebSocket disconnected. Retrying in 2s");
        setTimeout(connect, 2000);
    }

    ws.onerror = (err) => {
        console.error("WebSocket error: ", err);
        ws.close();
    }
}

// load
function initialize() {
    connect();
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

export const Car = { initialize, set, fetch };