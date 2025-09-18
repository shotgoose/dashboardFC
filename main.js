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
}

const dash = {
    last_time: 0,
}

car.rpm = 4000;


function update(time) {
    var dt = time - dash.last_time;
    dash.last_time = time;

    pull(dt);
    logic(dt);
    draw(dt);

    requestAnimationFrame(update);
}

function pull(dt) {
    //pull sensor information and update car variable
}

function logic(dt) {
    //perform arithmetic
    car.rpm_ratio = car.rpm / car.max_rpm;
}

function draw(dt) {
    //update visuals
    draw_gauge("tachometer_bar", car.rpm_ratio);
}

function draw_gauge(element_id, gauge_percent) {
    const img = document.getElementById(element_id);
    if (!img) return;
    if (gauge_percent > 1) gauge_percent = 1;

    const startAngle = Math.PI;
    var path = "50% 50%, 0% 50%";

    for (i = 0; i < (gauge_percent * 100); i++) {
        var pointAngle = startAngle + (3/2) * Math.PI * (i / 100);

        var x = (Math.cos(pointAngle) + 1) / 2;
        var y = (Math.sin(pointAngle) + 1) / 2;
        var xf = (x * 100) + "%";
        var yf = (y * 100) + "%";

        path = path + ", " + xf + " " + yf;
    }

    img.style.clipPath = "polygon(" + path + ")";
}

requestAnimationFrame(update);