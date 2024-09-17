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

function calculate(value, diff) {
    const resultElement = document.getElementById('result');

    if (diff <= 0) {
        resultElement.textContent = `Player has perfectly appraised this item and revealed its true value of ${value} gp!`;
        return;
    }

    var range = Math.floor(value * diff);
    var min = 0;
    var max = 0;
    while (min > value || max < value) {
        min = Math.floor(Math.random() * value);
        var max = min + range;
    }

    resultElement.textContent = `The item has an appraised value of ${min}-${max} gp.`;
}