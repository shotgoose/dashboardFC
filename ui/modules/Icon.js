// Handles tachometer icons

// define icons
const indicator_L = {
    name: 'indicator_L',
    onimg: 'indicator_L_on.png',
    offimg: 'indicator_L_off.png',
    state: false,
}

const indicator_R = {
    name: 'indicator_R',
    onimg: 'indicator_R_on.png',
    offimg: 'indicator_R_off.png',
    state: false,
}

const hazard = {
    name: 'hazard',
    onimg: 'hazard_on.png',
    offimg: 'hazard_off.png',
    state: false,
}

const highbeam = {
    name: 'highbeam',
    onimg: 'highbeam_on.png',
    offimg: 'highbeam_off.png',
    state: false,
}

const icons = [indicator_L, indicator_R, hazard, highbeam];

// itializes icon filepaths
function initialize() {
    for (let i = 0; i < icons.length; i++) {
        let icon = icons[i];
        const ON_URL = new URL('../assets/icons/' + icon.onimg, import.meta.url).href;
        const OFF_URL = new URL('../assets/icons/' + icon.offimg, import.meta.url).href;
        icon.onimg = ON_URL;
        icon.offimg = OFF_URL;
    }
}

// updates icons
function update() {
    for (let i = 0; i < icons.length; i++) {
        let icon = icons[i];
        let element = document.getElementById(icon.name);
        if (icon.state) {
            element.src = icon.onimg;
        }
        else {
            element.src = icon.offimg;
        }
    }
}

// function to toggle icon
function toggleIcon(iconName, forceState) {
    let icon = findIcon(iconName);

    let state = typeof forceState === 'boolean' ? forceState : !icon.state;
    icon.state = state;
}

// find icon by name
function findIcon(name) {
    for (let i = 0; i < icons.length; i++) {
        if (icons[i].name == name) {
            return icons[i];
        }
    }
    return null;
}

export const Icon = { initialize, update, toggleIcon };