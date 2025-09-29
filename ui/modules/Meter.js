// handles data formatting and output

const labels = [
    coolant_temp = {label: 'WTR TEMP', unit: '°C', ref: 'coolant_temp', x: 0, y: 0, r: (3 / 4) * Math.PI},
    oil_pressure = {label: 'OIL PRES', unit: 'psi', ref: 'oil_pressure', x: 0, y: 0, r: (1 / 2) * Math.PI},
    voltage = {label: 'VOLTS', unit: 'V', ref: 'voltage', x: 0, y: 0, r: (4 / 3) * Math.PI},
    fuel_level = {label: 'FUEL', unit: '%', ref: 'fuel_level', x: 0, y: 0, r: (1 / 4) * Math.PI},
    mpg = {label: 'MPG', unit: 'mpg', ref: 'mpg', x: 0, y: 0, r: (5 / 3) * Math.PI},
    //boost: {x: 0, y: 0},
]

function initialize() {

}

function label() {
    // start angle
    const startAngle = 0;

    // label layer creation
    //const layer = gauge.element.querySelector(".gauge-labels");
    const layer = document.getElementById('label-overlay');
    const frag = document.createDocumentFragment();

    // create labels
    for (let i = 0; i < meters.length; i++) {
        let meter = meters[i];

        // establish point 
        let pointAngle = startAngle + meter.r;
        let x = (Math.cos(pointAngle) + 1) / 2;
        let y = (Math.sin(pointAngle) + 1) / 2;

        // establish label value
        const value = "t.";

        // create text element
        const modelLabel = document.createElement('span');
        modelLabel.className = "model-label";
        modelLabel.textContent = value;
        modelLabel.style.left = (x * 100) + "%";
        modelLabel.style.top = (y * 100) + "%";

        // append to frag
        frag.appendChild(modelLabel);
    }

    // append to layer
    layer.appendChild(frag);

}

function update() { 

}