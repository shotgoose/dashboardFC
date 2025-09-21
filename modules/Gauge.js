import { Util } from './Util.js';

const gauges = [];

function create(config) {
    // Defaults
    const gauge = {
        startAngle: Math.PI,
        endAngle: (3 / 2) * Math.PI,
        minVal: 0,
        maxVal: 0,
        increment: 1,
        unitLabel: "Unlabeled", 
        unitRatio: 1,
        element: undefined,
        outline: undefined,
        bar: undefined,
        ratio: 0,
        barPolys: [],
        outlinePoly: [],
    };

    // Provided config
    gauge.startAngle = config.startAngle ?? gauge.startAngle;
    gauge.endAngle = config.endAngle ?? gauge.endAngle;
    gauge.minVal = config.minVal ?? gauge.minVal;
    gauge.maxVal = config.maxVal ?? gauge.maxVal;
    gauge.increment = config.increment ?? gauge.increment;
    gauge.unitLabel = config.unitLabel ?? gauge.unitLabel;
    gauge.unitRatio = config.unitRatio ?? gauge.unitRatio;
    gauge.element = document.getElementById(config.elementId) ?? gauge.element;
    gauge.outline = gauge.element.querySelector(".gauge_outline") ?? gauge.outline;
    gauge.bar = gauge.element.querySelector(".gauge_bar") ?? gauge.bar;

    // ratio
    const value = config.getVal ?? (() => 0);

    Object.defineProperty(gauge, 'ratio', {
        get() {
            if (gauge.maxVal <= 0) return 0;
            return value() / gauge.maxVal;
        }
    })

    // polygons
    const polygons = computePolys(gauge);
    gauge.outlinePoly = polygons.outlinePoly;
    gauge.barPolys = polygons.barPolys;

    // add to list
    gauges.push(gauge);

    return gauge;
  }

function computePolys(gauge) {
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

    // calculate all bar paths
    let barPolys = [];

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
        barPolys.push(barPoly);   
    }

    return { outlinePoly: outlinePoly, barPolys: barPolys};

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

function drawAll() {
    for (let i = 0; i < gauges.length; i++) {
        draw(gauges[i]);
    }
}

export const Gauge = {gauges, create, computePolys, draw, label, drawAll};

