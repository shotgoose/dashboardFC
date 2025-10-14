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
    // intialize modules
    console.log("test");
    Car.initialize();
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

//temp - set car variables for visuals
Car.set('rpm', 4000);
Car.set('mph', 44);
Car.set('fuel_level', 23);
Car.set('mpg', 16.5);
Car.set('voltage', 13.8)
Car.set('coolant_temp', 90.8);
Car.set('oil_pressure', 30);
Car.set('odometer', 147428);
Car.set('trip', 142);
Car.set('range', 42);