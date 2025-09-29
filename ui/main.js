import { Gauge } from './modules/Gauge.js';
import { Model } from './modules/Model.js';
import { Icon } from './modules/Icon.js';

window.Model = Model;

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
    max_mph: 120,
}

window.car = car;

const dash = {
    lastTime: 0,
    tachometer: Gauge.create({
        getVal: () => car.rpm,
        maxVal: car.max_rpm,
        increment: 1000,
        unitLabel: "RPM x1000",
        unitRatio: 1 / 1000,
        elementId: "tachometer",
    }),
    speedometer: Gauge.create({
        getVal: () => car.mph,
        maxVal: car.max_mph,
        increment: 10,
        unitLabel: "MPH",
        elementId: "speedometer",
    }),
}

car.rpm = 3561;
car.mph = 20;

function load() {
    // load dash
    Model.initialize();
    Icon.initialize();
    
}

let index = 0;

function update(time) {
    var dt = time - dash.lastTime;
    dash.lastTime = time;

    index = index + 1;
    if (index > 100) {
        index = 0;
        Icon.toggleIcon('indicator_L');
        Icon.toggleIcon('indicator_R');
        Icon.toggleIcon('hazard');
        Icon.toggleIcon('highbeam');
    }

    pull(dt);
    logic(dt);
    draw(dt);

    requestAnimationFrame(update);
}

function pull(dt) {
    // pull sensor information and update car variable

}

function logic(dt) {
    // perform arithmetic

    Model.update(dt / 1000);
    Icon.update();

    // ModelViewer.toggleAnimationState('headlightAction');
    // ModelViewer.toggleAnimationState('roofAction');
    // ModelViewer.toggleAnimationState('windowAction');

    // window resize
    window.addEventListener('resize', Model.fitToWrap);
}

function draw(dt) {
    // update visuals
    Gauge.drawAll();
    Model.render();
}

load();
requestAnimationFrame(update);