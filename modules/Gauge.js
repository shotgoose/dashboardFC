import { Util } from './Util.js';

function create(config) {
    const gauge = {
        startAngle: Math.PI,
        endAngle: (3 / 2) * Math.PI,
        minVal: 0,
        maxVal: 0,
        increments: 1,
        unitRatio: 1,
        unitLabel: "No Label", 
        element: undefined,
        outline: undefined,
        bar: undefined,
        ratio: 0,
        barPolys: [],
        outlinePoly: [],
    };

    // Default config
    gauge.startAngle = Math.PI;
    gauge.endAngle = (3 / 2) * Math.PI;
    gauge.barPolys = [];
    gauge.outlinePoly = [];

    // Provided config
    gauge.minVal = config.minVal ?? gauge.minVal;
    gauge.maxVal = config.maxVal ?? gauge.maxVal;
    gauge.increment = config.increment ?? gauge.increment;
    gauge.unitLabel = config.unitLabel ?? gauge.unitLabel;
    gauge.unitRatio = config.unitRatio ?? gauge.unitRatio;
    gauge.element = config.element ?? gauge.element;
    gauge.outline = config.outline ?? gauge.outline;
    gauge.bar = config.bar ?? gauge.bar;

    // preserve accessors (e.g., get ratio() { ... })
    const entries = Object.entries(Object.getOwnPropertyDescriptors(config))
    .filter(([_, d]) => 'get' in d || 'set' in d); // only accessors

    if (entries.length) {
        Object.defineProperties(gauge, Object.fromEntries(entries));
    } else if (config.ratio !== undefined) {

    // if they passed a plain value function or number
    gauge.ratio = config.ratio;

    return gauge;
  }

    // preserve
    Object.defineProperties(gauge, Object.getOwnPropertyDescriptors(config));

    return gauge;
}

function compute(gauge) {
    // fetch start and end angles, calculate difference
    const startAngle = gauge.startAngle;
    const endAngle = gauge.endAngle;
    const sweep = Util.clockWiseDiff(startAngle, endAngle);

    // initialize other constants
    const tickWidthRatio = 0.005;
    const segments = Math.round(sweep * (180 / Math.PI));

    // tick calculations
    const range = (gauge.maxVal - gauge.minVal);
    const ticks = Math.round(range / gauge.increment);
    const gap = sweep / ticks;
    const width = sweep * tickWidthRatio;

    // begin outline path
    let outlinePath = ["0%50%"];

    // calculate outline path
    for (let i = 0; i <= segments; i++) {
        // establish point
        let pointAngle = startAngle + sweep * (i / segments);

        let x = (Math.cos(pointAngle) + 1) / 2;
        let y = (Math.sin(pointAngle) + 1) / 2;
        let str = ((x * 100) + "%") + ((y * 100) + "%");

        // find if on tick
        const nearestTick = Math.round((pointAngle - startAngle) / gap);
        let onTick = false;

        if (nearestTick > 0 && nearestTick < ticks) {
            let tickAngle = startAngle + (nearestTick * gap);

            if (Math.abs(pointAngle - tickAngle) < width) {
                if (outlinePath[outlinePath.length - 1] != "50%50%") outlinePath.push("50%50%");
                onTick = true;
            }
        }

        if (!onTick) outlinePath.push(str);
    }

    let outlinePoly = "polygon(" + outlinePath.join(",") + ")"
    gauge.outlinePoly = outlinePoly;

    // calculate all bar paths
    for (let p = 0; p <= segments; p++) {
        // begin bar path
        let barPath = ["50%50%", "0%50%"];

        for (let i = 0; i <= segments; i++) {
            // establish point 
            let pointAngle = startAngle + sweep * (i / segments);

            let x = (Math.cos(pointAngle) + 1) / 2;
            let y = (Math.sin(pointAngle) + 1) / 2;
            let str = ((x * 100) + "%") + ((y * 100) + "%");

            // push to bar path
            if ((i / segments) <= (p / segments)) barPath.push(str);
        }

        // store bar path
        let barPoly = "polygon(" + barPath.join(",") + ")";
        gauge.barPolys.push(barPoly);   
    }

}

function draw(gauge) {
    // fetch images
    const barImg = gauge.bar;
    const outlineImg = gauge.outline;

    // return if images do not exist
    if (!barImg || !outlineImg) return;

    // fetch gauge percentage to fill, set to 100% if greater than 100%
    let gaugePercent = gauge.ratio;
    if (gaugePercent > 1) gaugePercent = 1;
    if (gaugePercent < 0) gaugePercent = 0;

    // fetch start and end angles, calculate difference
    const startAngle = gauge.startAngle;
    const endAngle = gauge.endAngle;
    const sweep = Util.clockWiseDiff(startAngle, endAngle);

    // convert gauge percent to segment value
    let segment = Math.round(gaugePercent * sweep * (180 / Math.PI));

    // set polyons
    barImg.style.clipPath = gauge.barPolys[segment];
    outlineImg.style.clipPath = gauge.outlinePoly;

}

function label(gauge) {

}

export const Gauge = {create, compute, draw, label};

