// import car module
import { Car } from './modules/Car.js';

// import ui modules
import { Gauge } from './modules/ui/Gauge.js';
import { Model } from './modules/ui/Model.js';
import { Icon } from './modules/ui/Icon.js';
import { Meter } from './modules/ui/Meter.js';
import { Message } from './modules/ui/Message.js';

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

    // ui module updates
    Model.update(dt / 1000);
    Gauge.update();
    Icon.update();
    Message.update();
    Meter.update();

    // render model
    Model.render();

    // window resize
    window.addEventListener('resize', Model.fitToWrap);

    requestAnimationFrame(loop);
}

load();
requestAnimationFrame(loop);