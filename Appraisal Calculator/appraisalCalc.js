function calculateAppraisal() {
    var value = parseInt(document.getElementById('value').value);
    var modifier = parseInt(document.getElementById('modifier').value);
    var DC = parseInt(document.getElementById('dc').value);
    var roll = parseInt(document.getElementById('roll').value);

    var adjustedValue = value * (modifier / 100);
    var diff = 3 - (0.25 * (roll - DC));
    if (roll - DC >= 5) {
        diff /= 1.25;
    }
    if (roll >= 20) {
        diff /= 1.25
    }

    calculate(adjustedValue, diff);
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function calculate(value, diff) {
    const resultElement = document.getElementById('result');

    if (diff > 3) {
        resultElement.textContent = `Player has failed to appraise the item and has no idea of its value.`;
        return;
    }

    if (diff <= 0) {
        resultElement.textContent = `Player has perfectly appraised this item and revealed its true value of ${value} gp!`;
        return;
    }

    var range = Math.floor(value * diff);
    var min = 0;
    var max = 0;
    while (min <= 0) {
        min = randomIntFromInterval(value - range, value);
    }
    max = min + range;

    resultElement.textContent = `The item has an appraised value of ${min}-${max} gp.`;
}