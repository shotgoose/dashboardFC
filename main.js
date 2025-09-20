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
    last_time: 0,
}

dash.rpm_gauge = {
    start_angle: Math.PI,
    end_angle: (3 / 2) * Math.PI,
    min_val: 0,
    max_val: 8000,
    increment: 1000,
    outline: document.getElementById("tachometer_outline"),
    bar: document.getElementById("tachometer_bar"),
    unit: "RPM x1000",
    unit_ratio: 1 / 1000,
    get ratio() {
        return car.rpm / car.max_rpm;
    },
}

dash.mph_gauge = {
    start_angle: Math.PI,
    end_angle: (3 /2) * Math.PI,
    min_val: 0,
    max_val: 160,
    increment: 20,
    outline: null,
    bar: null,
    unit_label: "MPH",
    unit_ratio: 1,
    get ratio() {
        return car.mph / car.max_mph;
    }
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
    draw_gauge(dash.rpm_gauge);
}

function draw_gauge(gauge) {
    // fetch images
    const bar_img = gauge.bar;
    const outline_img = gauge.outline;

    // return if images do not exist
    if (!bar_img || !outline_img) return;

    // fetch gauge percentage of fill, set to 100% if greater than 100%
    let gauge_percent = gauge.ratio;
    if (gauge_percent > 1) gauge_percent = 1;

    // fetch start and end angles, calculate difference
    const startAngle = gauge.start_angle;
    const endAngle = gauge.end_angle;
    const sweep = clockWiseDiff(startAngle, endAngle);

    let bar_d = ["50%50%", "0%50%"];

    for (let i = 0; i <= (gauge_percent * 100); i++) {
        let pointAngle = startAngle + sweep * (i / 100);

        let x = (Math.cos(pointAngle) + 1) / 2;
        let y = (Math.sin(pointAngle) + 1) / 2;
        let str = ((x * 100) + "%") + ((y * 100) + "%");

        bar_d.push(str);
    }

    // helper constants
    const tickWidthRatio = 0.005;
    const segments = 360;

    // tick calculations
    const range = (gauge.max_val - gauge.min_val);
    const ticks = Math.round(range / gauge.increment);
    const gap = sweep / ticks;
    const width = sweep * tickWidthRatio;

    let outline_d = ["0%50%"];

    for (let i = 0; i <= segments; i++) {
        let pointAngle = startAngle + sweep * (i / segments);

        const nearestTick = Math.round((pointAngle - startAngle) / gap);
        let onTick = false;

        if (nearestTick > 0 && nearestTick < ticks) {
            let tickAngle = startAngle + (nearestTick * gap);

            if (Math.abs(pointAngle - tickAngle) < width) {
                if (outline_d[outline_d.length - 1] != "50%50%") outline_d.push("50%50%");
                onTick = true;
            }
        }

        let x = (Math.cos(pointAngle) + 1) / 2;
        let y = (Math.sin(pointAngle) + 1) / 2;
        let str = ((x * 100) + "%") + ((y * 100) + "%");

        if (!onTick) outline_d.push(str);
    }

    bar_img.style.clipPath = "polygon(" + bar_d.join(", ") + ")";

    outline_img.style.clipPath = "polygon(" + outline_d.join(", ") + ")";
}

requestAnimationFrame(update);