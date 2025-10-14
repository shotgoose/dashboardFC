import { Car } from '../Car.js';

// fetch car
const car = Car.fetch();

// handles data formatting and output
const coolant_temp = {title: 'WTR TEMP', unit: '°C', ref: 'coolant_temp', r: (3 / 4) * Math.PI, minLength: 2}
const oil_pressure = {title: 'OIL PRES', unit: 'psi', ref: 'oil_pressure', r: (1 / 2) * Math.PI, minLength: 2}
const voltage = {title: 'VOLTS', unit: 'V', ref: 'voltage', x: 0, y: 0, r: (5 / 4) * Math.PI, minLength: 3}
const fuel_level = {title: 'FUEL', unit: '%', ref: 'fuel_level', r: (1 / 4) * Math.PI, minLength: 2}
const mpg = {title: 'MILEAGE', unit: 'mpg', ref: 'mpg', r: (7 / 4) * Math.PI, minLength: 3}

//speedo values
const odometer = {ref: 'odometer', element: document.getElementById('odometer-reading'), minLength: 3};
const trip = {ref: 'trip', element: document.getElementById('trip-reading'), minLength: 3};
const range = {ref: 'range', element: document.getElementById('range-reading'), minLength: 3};

const modelLabels = [ coolant_temp, oil_pressure, voltage, fuel_level, mpg];
const labels = [ coolant_temp, oil_pressure, voltage, fuel_level, mpg, odometer, trip, range];

function initialize() {
    // start angle
    const startAngle = 0;

    // label layer creation
    const layer = document.getElementById('model-overlay');
    const frag = document.createDocumentFragment();

    const labelOffset = 1.2;

    // create labels
    for (let i = 0; i < modelLabels.length; i++) {
        let label = modelLabels[i];

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
        reading.className = "model-data-value";
        reading.id = label.ref + "-reading";
        reading.textContent = "000";
        modelLabels[i].element = reading;

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
    for (let i = 0; i < labels.length; i++) {
        const label = labels[i];

        const val = car[label.ref];
        const str = val.toString().padStart(label.minLength, '0');
        label.element.textContent = str;
    }
}

export const Meter = { initialize, update }; 