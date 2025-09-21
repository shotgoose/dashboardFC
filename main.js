import { Gauge } from './modules/Gauge.js';
import { Util } from './modules/Util.js';

const car = {
    rpm: 0,
    rpm_ratio: 0,
    mph: 0,
    coolant_temp: 0,
    oil_pressure: 0,
    voltage: 0,
    fuel_level: 0,
    outside_temp: 0,  
    illumination: false,
    right_turn_signal: false,
    left_turn_signal: false,
    hazards: false,
    high_beam: false,
    max_rpm: 8000,
    max_mph: 160,
}

const dash = {
    lastTime: 0,
    tachometer: Gauge.create({
        minVal: 0,
        maxVal: 8000,
        increment: 1000,
        element: document.getElementById("tachometer"),
        outline: document.getElementById("tachometer_outline"),
        bar: document.getElementById("tachometer_bar"),
        unitLabel: "RPM x1000",
        unitRatio: 1 / 1000,
        get ratio() {
            return car.rpm / car.max_rpm;
        },
    }),
    speedometer: Gauge.create({
        minVal: 0,
        maxVal: 160,
        increment: 10,
        element: document.getElementById("speedometer"),
        outline: document.getElementById("speedometer_outline"),
        bar: document.getElementById("speedometer_bar"),
        unitLabel: "MPH",
        unitRatio: 1,
        get ratio() {
            return car.mph / car.max_mph;
        },
    }),
}

car.rpm = 0;
car.mph = 20;

function load() {
    // Load dash
    Gauge.compute(dash.tachometer);
    Gauge.compute(dash.speedometer);
}

function update(time) {
    var dt = time - dash.lastTime;
    dash.lastTime = time;

    pull(dt);
    logic(dt);
    draw(dt);

    requestAnimationFrame(update);
}

function pull(dt) {
    //pull sensor information and update car variable

}

var index = 0;

function logic(dt) {
    //perform arithmetic
    index = index + 0.008;
    car.rpm = 8000*Math.sin(index);
    car.mph = 160*Math.cos(index);
}

function draw(dt) {
    //update visuals
    Gauge.draw(dash.tachometer);
    Gauge.draw(dash.speedometer)
}

load();
requestAnimationFrame(update);