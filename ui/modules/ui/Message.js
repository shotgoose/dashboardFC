import { Car } from '../Car.js';

// fetch car
const car = Car.fetch();

// set variables
const messageElement = document.getElementById('message');
var urgent = false;
var messageContent = "";

function setMessage() {
    // test cases in order of priority

    // case: engine off and lights on
    if (car.rpm == 0 && car.illumination == true) {
        messageContent = "LIGHTS ON";
        urgent = false;
    }
    // case: engine off and low voltage
    else if (car.rpm == 0 && car.voltage < car.min_voltage_off) {
        messageContent = "LOW VOLTAGE";
        urgent = false;
    }
    // case: engine off
    else if (car.rpm == 0) {
        messageContent = "ENGINE OFF";
        urgent = false;
    }
    // case overrevving while warming
    else if (car.coolant_temp < car.min_coolant_temp && car.rpm > car.max_cold_revs) {
        messageContent = "SHIFT UP";
        urgent = true;
    }
    // case: over 7k revs
    else if (car.rpm > car.max_safe_rpm) {
        messageContent = "SHIFT UP";
        urgent = true;
    }
    // case: warming taking too long
    else if (car.coolant_temp < car.min_coolant_temp && car.runtime > car.max_warming_time) {
        messageContent = "EXCESSIVE WARMING TIME";
        urgent = false;
    }
    // case: coolant temp below operating
    else if (car.coolant_temp < car.min_coolant_temp) {
        messageContent = "WARMING UP";
        urgent = false;
    }
    // case: overheating
    else if (car.coolant_temp > car.max_coolant_temp) {
        messageContent = "ENGINE OVERHEATING";
        urgent = true;
    }
    // case: low oil pressure
    else if (car.oil_pressure < car.min_oil_pressure) {
        messageContent = "OIL PRESSURE LOW";
        urgent = true;
    }
    // case: high oil pressure
    else if (car.oil_pressure > car.max_oil_pressure) {
        messageContent = "OIL PRESSURE HIGH";
        urgent = true;
    }
    // case: low running voltage
    else if (car.voltage < car.min_voltage_on) {
        messageContent = "LOW RUNNING VOLTAGE";
        urgent = true;
    }
    // case: low fuel level
    else if (car.fuel_level <= car.fuel_warn_level) {
        messageContent = "FUEL LOW";
        urgent = false;
    }
    // case: lower than expected mileage
    else if (car.mpg <= car.expected_mpg) {
        messageContent = "LOW MPG";
        urgent = false;
    }
    // case: no message
    else {
        messageContent = "";
        urgent = false;
    }
}

function update() {
    // find message content
    setMessage();

    // set message
    messageElement.textContent = messageContent;

    // set message color based on urgency
    if (urgent) {
        messageElement.style.color = '#ff5555';
        messageElement.style.textShadow = '0 0 10px #ff3b3b, 0 0 20px #ff0000';
    }
    else {
        messageElement.style.color = 'white';
        messageElement.style.textShadow = '';
    }
    
}

export const Message = { update };