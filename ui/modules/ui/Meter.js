// handles data formatting and output
const coolant_temp = {title: 'WTR TEMP', unit: '°C', ref: 'coolant_temp', r: (3 / 4) * Math.PI}
const oil_pressure = {title: 'OIL PRES', unit: 'psi', ref: 'oil_pressure', r: (1 / 2) * Math.PI}
const voltage = {title: 'VOLTS', unit: 'V', ref: 'voltage', x: 0, y: 0, r: (5 / 4) * Math.PI}
const fuel_level = {title: 'FUEL', unit: '%', ref: 'fuel_level', r: (1 / 4) * Math.PI}
const mpg = {title: 'MILEAGE', unit: 'mpg', ref: 'mpg', r: (7 / 4) * Math.PI}

const labels = [ coolant_temp, oil_pressure, voltage, fuel_level, mpg];

function initialize() {
    label();
}

function label() {
    // start angle
    const startAngle = 0;

    // label layer creation
    //const layer = gauge.element.querySelector(".gauge-labels");
    const layer = document.getElementById('model-overlay');
    const frag = document.createDocumentFragment();

    //const br = document.createElement('break');

    const labelOffset = 1.2;

    // create labels
    for (let i = 0; i < labels.length; i++) {
        let label = labels[i];

        // establish point 
        let pointAngle = startAngle + label.r;
        let x = (labelOffset * Math.cos(pointAngle) + 1) / 2;
        let y = (-labelOffset * Math.sin(pointAngle) + 1) / 2;

        // create text element
        let modelLabel = document.createElement('span');
        modelLabel.className = "model-label";
        modelLabel.id = "stats-" + label.ref;
        modelLabel.style.left = ((x - .05) * 100) + "%";
        modelLabel.style.top = (y * 100) + "%";

        // create label title
        let title = document.createElement('span');
        title.textContent = label.title;

        // create stat sub element
        let reading = document.createElement('span');
        reading.className = "data-value";
        reading.id = label.ref + "-reading";
        reading.textContent = "000";

        // create unit label sub element
        let unit = document.createElement('span');
        unit.textContent = " " + label.unit;

        // append all to label
        modelLabel.appendChild(title);
        modelLabel.appendChild(document.createElement('br'));
        modelLabel.appendChild(reading);
        modelLabel.appendChild(unit);

        // append to frag
        frag.appendChild(modelLabel);
    }

    // append to layer
    layer.appendChild(frag);

}

function update(dt) { 
    //const car = fetchCar();
}

function fetchCar() {
    return window.car;
}

export const Meter = { initialize, label, update }; 