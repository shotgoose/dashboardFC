const data = {
    rpm: 0,
    mph: 0,
    coolantTemp: 0,
    oilPressure: 0,
    voltage: 0,
    fuelLevel: 0,
    outsideTemp: 0,  
    illumination: false,
    rightTurnSignal: false,
    leftTurnSignal: false,
    hazards: false,
    highBeam: false,
    maxrpm: 7000,
}

data.rpm = 4000;

function animate(timestamp) {
    draw_gauge("tachometer_bar", data.rpm/data.maxrpm);

    requestAnimationFrame(animate);
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

function gauge_units(element_id) {

}

requestAnimationFrame(animate);