function calculateAppraisal() {
    var value = parseInt(document.getElementById('appraisal-value').value);
    var modifier = parseInt(document.getElementById('appraisal-modifier').value);
    var DC = parseInt(document.getElementById('appraisal-dc').value);
    var roll = parseInt(document.getElementById('appraisal-roll').value);
    const resultElement = document.getElementById('appraisal-result');
    resultElement.style.opacity = 100;

    var adjustedValue = value * (modifier / 100);
    var diff = 3 - (0.25 * (roll - DC));
    if (roll - DC >= 5) {
        diff /= 1.25;
    }
    if (roll >= 20) {
        diff /= 1.25;
    }

    calculate(adjustedValue, diff);
}

function calculateBarterDC() {
    var price = parseInt(document.getElementById('listed-price').value);
    var value = parseInt(document.getElementById('real-price').value);
    var base = parseInt(document.getElementById('base-dc').value);
    var increment = Math.floor(value * 0.05);
    if (increment < 1) {
        increment = 1;
    }
    const resultElement = document.getElementById('barter-result');
    resultElement.style.opacity = 100;
    var total = Math.floor(base + ((price / increment) - 20));
    if (total < 1) {
        total = 1;
    }
    resultElement.textContent = `The bartering DC is ${total}.`;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function calculate(value, diff) {
    const resultElement = document.getElementById('appraisal-result');

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

    resultElement.textContent = `The item has an appraised value of ${min}-${max} gp. The true value is ${value} gp.`;
}
