// Handles tachometer icons
import { Car } from '../Car.js';

const car = Car.fetch();

// define icons
const indicator_L = {
    name: 'indicator_L',
    property: 'left_turn_signal',
    onurl: 'indicator_L_on.png',
    offurl: 'indicator_L_off.png',
    state: false,
}

const indicator_R = {
    name: 'indicator_R',
    property: 'right_turn_signal',
    onurl: 'indicator_R_on.png',
    offurl: 'indicator_R_off.png',
    state: false,
}

const hazard = {
    name: 'hazard',
    property: 'hazards',
    onurl: 'hazard_on.png',
    offurl: 'hazard_off.png',
    state: false,
}

const highbeam = {
    name: 'highbeam',
    property: 'high_beam',
    onurl: 'highbeam_on.png',
    offurl: 'highbeam_off.png',
    state: false,
}

const icons = [indicator_L, indicator_R, hazard, highbeam];

// itializes icon filepaths
function initialize() {
    for (let i = 0; i < icons.length; i++) {
        let icon = icons[i];

        const ON_IMG = document.createElement('img');
        const OFF_IMG = document.createElement('img');

        ON_IMG.src = '../../assets/icons/' + icon.onurl;
        OFF_IMG.src = '../../assets/icons/' + icon.offurl;

        ON_IMG.className = 'icon';
        OFF_IMG.className = 'icon';
        ON_IMG.id = icon.name;
        OFF_IMG.id = icon.name;

        icon.onimg = ON_IMG;
        icon.offimg = OFF_IMG;
    }
}

// updates icons
function update() {
    for (let i = 0; i < icons.length; i++) {
        let icon = icons[i];
        let state = car[icon.property];
        let element = document.getElementById(icon.name);
        if (state) {
            if (element == icon.onimg) continue;
            element.replaceWith(icon.onimg);
        }
        else {
            if (element == icon.offimg) continue;
            element.replaceWith(icon.offimg);
        }
    }
}

// // function to toggle icon
// function toggleIcon(iconName, forceState) {
//     let icon = findIcon(iconName);

//     let state = typeof forceState === 'boolean' ? forceState : !icon.state;
//     icon.state = state;
// }

// // find icon by name
// function findIcon(name) {
//     for (let i = 0; i < icons.length; i++) {
//         if (icons[i].name == name) {
//             return icons[i];
//         }
//     }
//     return null;
// }

export const Icon = { initialize, update };