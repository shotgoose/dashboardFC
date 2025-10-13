// import ui modules
import { Gauge } from './modules/ui/Gauge.js';
import { Model } from './modules/ui/Model.js';
import { Icon } from './modules/ui/Icon.js';
import { Meter } from './modules/ui/Meter.js';

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
window.prevTime = 0;

//temp - set mph and rpm for visuals
car.rpm = 3561;
car.mph = 20;

function load() {
    // intialize modules
    Model.initialize();
    Icon.initialize();
    Meter.initialize();
    Gauge.initialize();
}

function loop(time) {
    var dt = time - window.prevTime;
    window.prevTime = time;

    pull(dt);
    logic(dt);
    draw(dt);

    requestAnimationFrame(loop);
}

function pull(dt) {
    // pull sensor information and update car variable

}

function logic(dt) {
    // module updates
    Model.update(dt / 1000);
    Icon.update();

    // window resize
    window.addEventListener('resize', Model.fitToWrap);
}

function draw(dt) {
    // render visuals
    Gauge.render();
    Model.render();
}

load();
requestAnimationFrame(loop);