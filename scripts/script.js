const sidebarButton = document.getElementById("sidebar-button");
const backButton = document.getElementById("back-button");
const sidebar = document.querySelector(".sidebar");
const diceButtons = document.querySelectorAll(".dice-button");
const diceInput = document.getElementById("dice-input");
const diceLabels = document.querySelectorAll(".dice-label");
const diceSizes = ["d20", "d12", "d10", "d8", "d6", "d4"];
var flatNum = 0;
const rollButton = document.getElementById("roll-button");
const saveRollButton = document.getElementById("save-roll-button");
const resetButton = document.getElementById("reset-button");
const saveButton = document.getElementById("save-button");
const loadButton = document.getElementById("load-button");
const sidebarList = document.getElementById("sidebar-list");
const diceCalc = document.getElementById("dice-calculation");
const diceTotal = document.getElementById("dice-total");


document.onload = () => {
    sidebar.classList.add("active");
    sidebarList.classList.add("active");
    saveButton.classList.add("active");
    loadButton.classList.add("active");
}

window.onload = () => {
    if (window.location.href.includes("?")) {
        const url = window.location.href.toString();
        const query = url.substring(url.indexOf("?") + 1);
        diceInput.value = query;
        rollButton.click();
    }
    loadFromLocalStorage();
    updateDice();
}

sidebarButton.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    sidebarList.classList.toggle("active");
    saveButton.classList.toggle("active");
    loadButton.classList.toggle("active");
});

for (let i = 0; i < diceButtons.length; i++) {
    const button = diceButtons[i];
    button.addEventListener("click", () => {
        diceLabels[i].textContent++;
        let pos = diceInput.value.indexOf(diceSizes[i]);
        let dieSize = "";
        if (pos !== -1) {
            let posStart = pos;
            while (posStart > 0 && /\d/.test(diceInput.value[posStart - 1])) {
                posStart--;
            }
            dieSize = diceInput.value.substring(posStart, pos + diceSizes[i].length);
        }
        if (dieSize) {
            let numDice;
            if (dieSize.startsWith('d')) {
                numDice = 1;
            }
            else {
                numDice = parseInt(dieSize.substring(0, dieSize.indexOf('d')));
            }
            diceInput.value = diceInput.value.replace(dieSize, `${numDice + 1}${diceSizes[i]}`);
        }
        else {
            diceInput.value = diceInput.value + "+" + "1" + diceSizes[i];
        }
        // cleanup
        if (diceInput.value.includes("++")) {
            diceInput.value = diceInput.value.replace("++", "+");
        }
        if (diceInput.value.substring(diceInput.value.length - 1) == "+") {
            diceInput.value = diceInput.value.substring(0, diceInput.value.length - 1);
        }
        if (diceInput.value.substring(0, 1) == "+") {
            diceInput.value = diceInput.value.substring(1, diceInput.value.length);
        }
    });
    button.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (diceLabels[i].textContent > 0) {
            diceLabels[i].textContent--;
            let pos = diceInput.value.indexOf(diceSizes[i]);
            let dieSize = "";
            if (pos !== -1) {
                let posStart = pos;
                while (posStart > 0 && /\d/.test(diceInput.value[posStart - 1])) {
                    posStart--;
                }
                dieSize = diceInput.value.substring(posStart, pos + diceSizes[i].length);
            }
            if (dieSize) {
                let numDice = dieSize.startsWith('d') ? 1 : parseInt(dieSize.substring(0, dieSize.indexOf('d')));
                numDice = Math.max(0, numDice - 1);
                const newTerm = numDice > 0 ? `${numDice}${diceSizes[i]}` : '';
                diceInput.value = diceInput.value.replace(dieSize, newTerm);
            }
        }
        // cleanup
        if (diceInput.value.includes("++")) {
            diceInput.value = diceInput.value.replace("++", "+");
        }
        if (diceInput.value.substring(diceInput.value.length - 1) == "+") {
            diceInput.value = diceInput.value.substring(0, diceInput.value.length - 1);
        }
        if (diceInput.value.substring(0, 1) == "+") {
            diceInput.value = diceInput.value.substring(1, diceInput.value.length);
        }
    });
};

diceInput.addEventListener('input', () => {
    updateDice();
});

function updateDice() {
    flatNum = 0;
    var input = diceInput.value.toLowerCase();
    for (let i = 0; i < diceLabels.length; i++) {
        diceLabels[i].textContent = 0;
    }
    input = input.replace(/\s/g, '');
    input = input.split("+");
    for (let i = 0; i < input.length; i++) {
        if (/^[0-9]*$/.test(input[i])) {
            input[i] = parseInt(input[i]);
        }
    }
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < diceSizes.length; j++) {
            if (typeof input[i] === "string" && input[i].includes(diceSizes[j])) {
                if (input[i].charAt(0) == "d") {
                    diceLabels[j].textContent = parseInt(diceLabels[j].textContent) + 1;
                }
                else {
                    var index = input[i].indexOf("d");
                    diceLabels[j].textContent = parseInt(diceLabels[j].textContent) + parseInt(input[i].substring(0, index));
                }
            }
        }
        if (typeof input[i] === "number") {
            flatNum += input[i];
        }
    }
}

rollButton.addEventListener("click", () => {
    const rolls = diceInput.value.split("+");
    let results = [];
    let total = 0;
    for (let roll of rolls) {
        roll = roll.trim();
        roll = roll.toLowerCase();
        if (/^\d+d\d+$/.test(roll)) {
            const parts = roll.split("d");
            const numDice = parseInt(parts[0]);
            const dieSize = parseInt(parts[1]);

            let rollSum = 0;
            for (let i = 0; i < numDice; i++) {
                rollSum += Math.floor(Math.random() * dieSize) + 1;
            }
            results.push(rollSum.toString());
            total += rollSum;
        }
        else if (/^\d+$/.test(roll)) {
            total += parseInt(roll);
        }
    }
    let output = diceInput.value + " = ";
    output += results.join(" + ");
    if (flatNum != 0) {
        output += " + " + flatNum;
    }
    output += " = " + total;
    if (output.includes(" + NaN")) {
        output = output.replace(" + NaN", "");
    }
    diceCalc.innerHTML = output;
    diceTotal.innerHTML = "Total: " + total;
    if (diceCalc.innerHTML.includes("=  = 0")) {
        diceCalc.innerHTML = "Please enter a valid roll.";
        diceTotal.innerHTML = "‎ ";
    }
    updateDice();
});

saveRollButton.addEventListener("click", () => {
    const roll = document.createElement("button");
    roll.textContent = diceInput.value;
    roll.addEventListener("click", () => {
        diceInput.value = roll.textContent;
        rollButton.click();
        sidebarButton.click();
    });
    const listItem = document.createElement("li");
    const xButton = document.createElement("button");
    xButton.textContent = "X";
    xButton.id = "x-button";
    xButton.addEventListener("click", () => {
        listItem.parentNode.removeChild(listItem);
        saveToLocalStorage();
    });
    listItem.appendChild(roll);
    listItem.appendChild(xButton);
    sidebarList.appendChild(listItem);
    saveToLocalStorage();
});

resetButton.addEventListener("click", () => {
    diceInput.value = "";
    for (let i = 0; i < diceLabels.length; i++) {
        diceLabels[i].textContent = 0;
    }
    flatNum = 0;
    document.getElementById("dice-calculation").innerHTML = "Click on the dice or type in the text box to enter your roll.";
    document.getElementById("dice-total").innerHTML = "‎ ";
});

window.addEventListener('resize', function () {
    var buttons = document.querySelectorAll('.sidebar-list li button');
    buttons.forEach(function (button) {
        if (button.offsetWidth / button.parentNode.offsetWidth < 0.1) {
            button.style.visibility = 'hidden';
        } else {
            button.style.visibility = 'visible';
        }
    });
});

function saveToLocalStorage() {
    const buttons = document.querySelectorAll('#sidebar-list li button:not(#x-button)');
    const buttonContents = Array.from(buttons).map(button => button.textContent);
    localStorage.setItem('buttonContents', JSON.stringify(buttonContents));
}

saveButton.addEventListener("click", () => {
    const buttonContents = JSON.parse(localStorage.getItem('buttonContents'));
    const blob = new Blob([JSON.stringify(buttonContents)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'saved_rolls.json';
    link.click();
});

loadButton.addEventListener("click", () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    fileInput.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const buttonContents = JSON.parse(event.target.result);
            while (sidebarList.firstChild) {
                sidebarList.removeChild(sidebarList.firstChild);
            }
            buttonContents.forEach(content => {
                const roll = document.createElement("button");
                roll.textContent = content;
                roll.addEventListener("click", () => {
                    diceInput.value = roll.textContent;
                    rollButton.click();
                    sidebarButton.click();
                });
                const listItem = document.createElement("li");
                const xButton = document.createElement("button");
                xButton.textContent = "X";
                xButton.id = "x-button";
                xButton.addEventListener("click", () => {
                    listItem.parentNode.removeChild(listItem);
                    saveToLocalStorage();
                });
                listItem.appendChild(roll);
                listItem.appendChild(xButton);
                sidebarList.appendChild(listItem);
            });
        };
        reader.readAsText(file);
    };
    fileInput.click();
});

function loadFromLocalStorage() {
    const buttonContents = JSON.parse(localStorage.getItem('buttonContents'));
    while (sidebarList.firstChild) {
        sidebarList.removeChild(sidebarList.firstChild);
    }
    buttonContents.forEach(content => {
        const roll = document.createElement("button");
        roll.textContent = content;
        roll.addEventListener("click", () => {
            diceInput.value = roll.textContent;
            rollButton.click();
            sidebarButton.click();
        });
        const listItem = document.createElement("li");
        const xButton = document.createElement("button");
        xButton.textContent = "X";
        xButton.id = "x-button";
        xButton.addEventListener("click", () => {
            listItem.parentNode.removeChild(listItem);
            saveToLocalStorage();
        });
        listItem.appendChild(roll);
        listItem.appendChild(xButton);
        sidebarList.appendChild(listItem);
    });
}