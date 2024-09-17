let chartInstance = null;

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
        diff /= 1.25;
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

// Function to run 10000 simulations and generate a histogram
function runSimulations() {
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
        diff /= 1.25;
    }

    var minValues = [];
    for (let i = 0; i < 1000; i++) {
        let range = Math.floor(adjustedValue * diff);
        let min = 0;
        while (min <= 0) {
            min = randomIntFromInterval(adjustedValue - range, adjustedValue);
        }
        minValues.push(min);
    }

    // Create bins for the histogram
    const binSize = 10;
    const bins = {};
    minValues.forEach(min => {
        const bin = Math.floor(min / binSize) * binSize;
        bins[bin] = (bins[bin] || 0) + 1;
    });

    // Data for the chart
    const labels = Object.keys(bins);
    const data = Object.values(bins);

    // Destroy the previous chart instance if it exists
    if (chartInstance !== null) {
        chartInstance.destroy();
    }

    // Create the chart
    var ctx = document.getElementById('chart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frequency of Min Values',
                data: data,
                backgroundColor: 'rgba(40, 167, 69, 0.5)',
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Min Value Bins'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frequency'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}
