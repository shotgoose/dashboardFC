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

car.rpm = 0;


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

var index = 0;

function logic(dt) {
    //perform arithmetic
    index = index + 0.005;
    car.rpm = 8000*Math.sin(index);

    car.rpm_ratio = car.rpm / car.max_rpm;
}

function draw(dt) {
    //update visuals
    draw_gauge_bar("tachometer_bar", car.rpm_ratio);
    // draw_gauge_label("tachometer_outline", 0, 8, 1);
}

function draw_gauge_bar(element_id, gauge_percent) {
    const img = document.getElementById(element_id);
    if (!img) return;
    if (gauge_percent > 1) gauge_percent = 1;

    const startAngle = Math.PI;
    const endAngle = (3 / 2) * Math.PI;

    var path = "50% 50%, 0% 50%";

    for (i = 0; i <= (gauge_percent * 100); i++) {
        var pointAngle = startAngle + endAngle * (i / 100);

        var x = (Math.cos(pointAngle) + 1) / 2;
        var y = (Math.sin(pointAngle) + 1) / 2;
        var xf = (x * 100) + "%";
        var yf = (y * 100) + "%";

        path = path + ", " + xf + " " + yf;
    }

    img.style.clipPath = "polygon(" + path + ")";
}

// function draw_gauge_label(element_id, min_val, max_val, increment) {
//     const img = document.getElementById(element_id);
//     const div = img.parentElement;
//     if (!img) return;

//     const startAngle = Math.PI;
//     const endAngle = (3 / 2) * Math.PI;

//     const range = (max_val - min_val);
//     const labels = range / increment;
//     const gap = endAngle / labels;

//     var path = "0% 50%";

//     for (i = 0; i <= 100; i++) {
//         var pointAngle = startAngle + endAngle * (i / 100);
//         var skip = false;

//         for (a = 1; a <= labels; a++) {
//             var labelAngleStart = startAngle + a * gap - gap / 20;
//             var labelAngleEnd = startAngle + a * gap + gap / 20;

//             if (pointAngle > labelAngleStart && pointAngle < labelAngleEnd) {
//                 path = path + ", 50% 50%";
//                 skip = true;
//             }

//         }

//         var x = (Math.cos(pointAngle) + 1) / 2;
//         var y = (Math.sin(pointAngle) + 1) / 2;
//         var xf = (x * 100) + "%";
//         var yf = (y * 100) + "%";

//         if (!skip) path = path + ", " + xf + " " + yf;
//     }

//     img.style.clipPath = "polygon(" + path + ")";
// }

requestAnimationFrame(update);