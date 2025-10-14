// import ui modules
import { Gauge } from './modules/ui/Gauge.js';
import { Model } from './modules/ui/Model.js';
import { Icon } from './modules/ui/Icon.js';
import { Meter } from './modules/ui/Meter.js';
import { Message } from './modules/ui/Message.js';

// import logic modules
import { Car } from './modules/Car.js';

window.prevTime = 0;

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
    Message.update();
    Meter.update();

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

//temp - set mph and rpm for visuals
Car.set('rpm', 5423)
Car.set('mph', 44);
Car.set('fuel_level', 21);
Car.set('mpg', 12.5);
Car.set('voltage', 13.8)
Car.set('coolant_temp', 120);
Car.set('oil_pressure', 30);