// declare car 
const car = {
    rpm: 0,
    rpm_ratio: 0,
    mph: 0,
    coolant_temp: 0,
    oil_pressure: 0,
    voltage: 0,
    fuel_level: 0,
    outside_temp: 0,
    mileage: 0,
    runtime: 0, // time engine has been on in seconds
    illumination: false,
    right_turn_signal: false,
    left_turn_signal: false,
    hazards: false,
    high_beam: false,
    max_rpm: 8000,
    max_mph: 120,
    max_safe_rpm: 6800,
    min_coolant_temp: 0, //adjust
    max_coolant_temp: 0, //adjust
    min_oil_pressure: 20, //adjust
    max_oil_pressure: 0, //adjust
    min_voltage_on: 13.5, //adjust if needed
    min_voltage_off: 12.4, //adjust if needed
    expected_mileage: 14, //adjust if needed
    fuel_warn_level: .25,
    max_cold_revs: 3500, //adjust if needed
    max_warming_time: 300, //adjust if needed
}

// function to set car variable
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
    return Object.freeze(structuredClone(car));
}

export const Car = { set, fetch };