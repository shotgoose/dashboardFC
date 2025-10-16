// import car module
import { Car } from './modules/Car.js';

// import ui modules
import { Gauge } from './modules/ui/Gauge.js';
import { Model } from './modules/ui/Model.js';
import { Icon } from './modules/ui/Icon.js';
import { Meter } from './modules/ui/Meter.js';
import { Message } from './modules/ui/Message.js';

window.icon = Icon;


window.prevTime = 0;

function load() {
    // connect to car data stream
    Car.connect();

    // intialize modules
    Model.initialize();
    Icon.initialize();
    Meter.initialize();
    Gauge.initialize();
}

function loop(time) {
    var dt = time - window.prevTime;
    window.prevTime = time;

    update(dt);
    draw(dt);

    requestAnimationFrame(loop);
}

function update(dt) {
    // ui module updates
    Model.update(dt / 1000);
    Icon.update();
    Message.update();
    Meter.update();

    // window resize
    window.addEventListener('resize', Model.fitToWrap);
}

function draw(dt) {
    // draw visuals
    Gauge.render();
    Model.render();
}

load();
requestAnimationFrame(loop);