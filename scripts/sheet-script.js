const proficiencyH1 = document.getElementById("proficiency-h1");
const expertiseH1 = document.getElementById("expertise-h1")
proficiencyH1.textContent = "";
expertiseH1.textContent = "";
const pointBuyButtons = document.querySelectorAll("#point-buy-group button");
const pointsUsedElement = document.getElementById("points-used");
const raceSelect = document.getElementById("race");
const subclassSelect = document.getElementById("subclass");
const subclassLabel = document.querySelector("label[for='subclass']");
const subraceSelect = document.getElementById("subrace");
const subraceLabel = document.querySelector("label[for='subrace']");
subclassSelect.style.display = "none";
subclassLabel.style.display = "none";
subraceSelect.style.display = "none";
subraceLabel.style.display = "none";
const bonusButtons = document.querySelectorAll('.other-stat-bonuses-group button');
let backgroundSkills = [];
const levelInput = document.getElementById("level");
levelInput.value = 1;
const classSelect = document.getElementById("class");
const spellcasterCheckbox = document.getElementById("spellcaster");
const spellcastingArea = document.getElementById("spellcasting-area");
spellcastingArea.style.display = "none";
const info = document.getElementById("info");
const characterName = document.getElementById("character-name");
const saveButton = document.getElementById("save-button");
const loadButton = document.getElementById("loadButton");
const fileInput = document.getElementById("fileInput");
const background = document.getElementById("background");
const alignment = document.getElementById("alignment");
const languages = document.getElementById("languages");
const equipment = document.getElementById("equipment");
const otherFeatures = document.getElementById("other-features");
let pointsUsed = parseInt(pointsUsedElement.textContent.split(":")[1].trim().split("/")[0]);

function init() {
    loadData("race", "https://api.open5e.com/v1/races/");
    loadData("class", "https://api.open5e.com/v1/classes/");
    loadData("background", "https://api.open5e.com/v1/backgrounds/");
    loadData("spell", "https://api.open5e.com/v1/spells/");
}

function loadData(key, url) {
    if (localStorage.getItem(key) != null) {
        let data = JSON.parse(localStorage.getItem(key));
        populateDropdown(data, key);
    } else {
        fetchData(url)
            .then(allData => {
                if (allData) {
                    console.log("All data:", allData);
                    localStorage.setItem(key, JSON.stringify(allData));
                    populateDropdown(allData, key);
                } else {
                    console.log("No data fetched.");
                }
            });
    }
}

async function fetchData(url) {
    let results = [];
    try {
        while (url) {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            for (let i = 0; i < data.results.length; i++) {
                if (data.results[i].page != "") {
                    results.push(data.results[i]);
                }
            }
            url = data.next;
        }
        return results;
    } catch (error) {
        if (error.name == "TypeError" && error.message.startsWith("Failed to fetch")) {
            console.error("Network error:", error);
        } else {
            console.error("Error fetching data:", error);
        }
    }
}

function populateDropdown(dataArray, key) {
    if (key == "class") {
        document.getElementById("class").addEventListener("change", populateSkills);
        document.getElementById("class").addEventListener("change", updateSpellSlots);
        document.getElementById("class").addEventListener("change", populateSpellDropdowns)
    } else if (key == "race") {
        document.getElementById("race").addEventListener("change", populateStatBonuses);
        dataArray = dataArray.filter(item => item.name != "Gearforged");
        dataArray = dataArray.filter(item => item.name != "Half-Elf");
        dataArray = dataArray.filter(item => item.name.subrace != "Human/Half-Elf Heritage");
        const darakhul = dataArray.filter(item => item.name == "Darakhul");
        const darakhulSubraces = darakhul[0].subraces;
        darakhulSubraces.splice(7, 1);
        dataArray.splice(2, 1, darakhul[0]);
        localStorage.setItem("race", JSON.stringify(dataArray));
    } else if (key == "background") {
        document.getElementById("background").addEventListener("change", populateSkills);
        dataArray = dataArray.filter(item => item.name != "Guildmember");
        dataArray = dataArray.filter(item => item.name != "Lyceum Student");
    }
    const select = document.getElementById(key);
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "";
    select.appendChild(blank);
    dataArray.forEach(item => {
        const option = document.createElement("option");
        option.value = item.name;
        option.textContent = item.name;
        select.appendChild(option);
    });
}

const classSkills = {
    "Barbarian": { name: "Barbarian", skills: ["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"], num: 2 },
    "Bard": { name: "Bard", skills: ["Acrobatics", "Animal Handling", "Arcana", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival", "Athletics"], num: 3 },
    "Cleric": { name: "Cleric", skills: ["History", "Insight", "Medicine", "Persuasion", "Religion"], num: 2 },
    "Druid": { name: "Druid", skills: ["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"], num: 2 },
    "Fighter": { name: "Fighter", skills: ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"], num: 2 },
    "Monk": { name: "Monk", skills: ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"], num: 2 },
    "Paladin": { name: "Paladin", skills: ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"], num: 2 },
    "Ranger": { name: "Ranger", skills: ["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"], num: 3 },
    "Rogue": { name: "Rogue", skills: ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"], num: 4 },
    "Sorcerer": { name: "Sorcerer", skills: ["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"], num: 2 },
    "Warlock": { name: "Warlock", skills: ["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"], num: 2 },
    "Wizard": { name: "Wizard", skills: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"], num: 2 }
};

let previousSelectedSkills = [];
let previousSelectedExpertise = [];

function populateSkills() {
    if (document.getElementById("class").value == "") {
        document.getElementById("skill-dropdowns").innerHTML = "";
        document.getElementById("expertise-dropdowns").innerHTML = "";
        proficiencyH1.textContent = "";
        if (document.getElementById("background").value != "") {
            populateBackgroundSkills();
            proficiencyH1.textContent = "Skill Proficiencies";
        }
        return;
    }
    proficiencyH1.textContent = "Skill Proficiencies";
    const selectedClass = document.getElementById("class").value;
    let classInfo;
    for (let className in classSkills) {
        if (classSkills[className].name == selectedClass) {
            classInfo = classSkills[className];
            break;
        }
    }
    if (!classInfo) {
        console.error(`No class info found for selected class: ${selectedClass}`);
        return;
    }
    const skills = classInfo.skills;
    const num = classInfo.num;
    const skillsDropdowns = document.getElementById("skill-dropdowns");
    skillsDropdowns.innerHTML = "";
    const selects = [];
    for (let i = 0; i < num; i++) {
        const select = document.createElement("select");
        const blank = document.createElement("option");
        blank.value = "";
        blank.textContent = "";
        select.appendChild(blank);
        skills.forEach(skill => {
            if (!backgroundSkills.includes(skill)) {
                const option = document.createElement("option");
                option.value = skill;
                option.textContent = skill;
                select.appendChild(option);
            }
        });
        selects.push(select);
        skillsDropdowns.appendChild(select);
    }
    selects.forEach(select => {
        select.addEventListener("change", () => {
            const selectedSkills = selects.map(select => select.value).filter(value => value);
            selects.forEach(select => {
                const value = select.value;
                select.innerHTML = "";
                const blank = document.createElement("option");
                blank.value = "";
                blank.textContent = "";
                select.appendChild(blank);
                skills.forEach(skill => {
                    if (!selectedSkills.includes(skill) || skill == value) {
                        const option = document.createElement("option");
                        option.value = skill;
                        option.textContent = skill;
                        select.appendChild(option);
                    }
                });
                select.value = value;
            });
            populateExpertiseDropdowns(selectedSkills);
            previousSelectedSkills = [...selectedSkills];
        });
    });
    populateExpertiseDropdowns([]);
    populateBackgroundSkills();
}

function populateExpertiseDropdowns(selectedSkills) {
    const selectedClass = document.getElementById("class").value;
    const expertiseDropdowns = document.getElementById("expertise-dropdowns");
    let num = 0;
    if (selectedClass == "Rogue" && parseInt(levelInput.value) >= 6) {
        num = 4;
    } else if (selectedClass == "Bard" && parseInt(levelInput.value) >= 10) {
        num = 4;
    } else if (selectedClass == "Rogue" || selectedClass == "Bard") {
        num = 2;
    } else {
        expertiseH1.textContent = "";
    }
    for (let i = expertiseDropdowns.children.length; i < num; i++) {
        const select = document.createElement("select");
        expertiseDropdowns.appendChild(select);
        select.addEventListener("change", function () {
            const selects = Array.from(expertiseDropdowns.children);
            const selectedExpertises = selects.map(select => select.value).filter(value => value !== "");
            selects.forEach(select => {
                const options = Array.from(select.options);
                options.forEach(option => {
                    if (selectedExpertises.includes(option.value) && option.value !== select.value) {
                        select.removeChild(option);
                    }
                });
            });
            selects.forEach(select => {
                selectedSkills.forEach(skill => {
                    if (!selectedExpertises.includes(skill)) {
                        const option = document.createElement("option");
                        option.value = skill;
                        option.textContent = skill;
                        select.appendChild(option);
                    }
                });
            });
        });
    }
    updateExpertiseOptions(selectedSkills);
}

function updateExpertiseOptions(selectedSkills) {
    const expertiseDropdowns = document.getElementById("expertise-dropdowns");
    const selects = Array.from(expertiseDropdowns.children);
    selects.forEach(select => {
        const value = select.value;
        select.textContent = "";
        const blank = document.createElement("option");
        blank.value = "";
        blank.textContent = "";
        select.appendChild(blank);
        selectedSkills.forEach(skill => {
            if (!selects.some(otherSelect => otherSelect != select && otherSelect.value == skill) || skill == value) {
                const option = document.createElement("option");
                option.value = skill;
                option.textContent = skill;
                select.appendChild(option);
            }
        });
        select.value = value;
    });
}

pointBuyButtons.forEach(button => {
    button.addEventListener("click", function (event) {
        const parent = event.target.parentElement;
        const statElement = parent.querySelector("h1");
        let statValue = parseInt(statElement.textContent);
        if (event.target.textContent == "⌃") {
            if ((statValue == 13 || statValue == 14) && pointsUsed <= 25) {
                statValue++;
                pointsUsed += 2;
            } else if (statValue < 13 && pointsUsed < 27) {
                statValue++;
                pointsUsed++;
            }
        } else if (event.target.textContent == "⌄" && statValue > 8) {
            if (statValue == 14 || statValue == 15) {
                statValue--;
                pointsUsed -= 2;
            } else if (statValue <= 13) {
                statValue--;
                pointsUsed--;
            }
        }
        statElement.textContent = statValue;
        pointsUsedElement.textContent = `Points Used: ${pointsUsed}/27`;
        updateStatTotals();
        updateSpellSlots();
        populateSpellDropdowns();
    });
});

raceSelect.addEventListener("change", function (event) {
    const subraceLabel = document.querySelector("label[for='subrace']");
    let selectedRace = document.getElementById("race").value;
    subraceSelect.innerHTML = "";
    subraceSelect.style.display = "none";
    if (subraceLabel) {
        subraceLabel.style.display = "none";
    }
    const races = JSON.parse(localStorage.getItem("race"));
    selectedRace = races.find(race => race.name == event.target.value);
    if (selectedRace && selectedRace.subraces && selectedRace.subraces.length > 0) {
        selectedRace.subraces.forEach(subrace => {
            const option = document.createElement("option");
            option.value = subrace.name;
            option.textContent = subrace.name;
            subraceSelect.appendChild(option);
        });
        subraceSelect.style.display = "block";
        if (subraceLabel) {
            subraceLabel.style.display = "block";
        }
    } else if (!selectedRace) {
        console.error(`Race with name ${event.target.value} not found`);
    }
    populateStatBonuses();
    updateStatTotals();
    populateSpellDropdowns();
});

function populateStatBonuses() {
    const h1Elements = document.querySelectorAll('h1[id$="-racial-h1"]');
    h1Elements.forEach(h1 => {
        h1.innerHTML = "+0";
    });
    const races = JSON.parse(localStorage.getItem("race"));
    const selectedRace = races.find(race => race.name == document.getElementById("race").value);
    const selectedSubrace = selectedRace.subraces.find(subrace => subrace.name == document.getElementById("subrace").value);
    if (selectedRace.asi) {
        selectedRace.asi.forEach(bonus => {
            bonus.attributes.forEach(attribute => {
                const h1 = document.getElementById(attribute.toLowerCase() + "-racial-h1");
                h1.innerHTML = `+${bonus.value}`;
            });
        });
    }
    if (selectedSubrace && selectedSubrace.asi) {
        selectedSubrace.asi.forEach(bonus => {
            bonus.attributes.forEach(attribute => {
                const h1 = document.getElementById(attribute.toLowerCase() + "-racial-h1");
                const currentBonus = parseInt(h1.innerHTML.replace('+', '')) || 0;
                h1.innerHTML = `+${currentBonus + bonus.value}`;
            });
        });
    }
}

subraceSelect.addEventListener("change", function (event) {
    populateStatBonuses();
    updateStatTotals();
    populateSpellDropdowns();
});

bonusButtons.forEach(button => {
    button.addEventListener("click", function (event) {
        const parent = event.target.parentElement;
        const statElement = parent.querySelector("h1");
        let statValue = parseInt(statElement.textContent);
        if (event.target.textContent == "⌃") {
            statValue++;
        } else if (event.target.textContent == "⌄") {
            statValue--;
        }
        if (statValue < 0) {
            statElement.textContent = statValue;
        }
        else {
            statElement.textContent = "+" + statValue;
        }
        updateStatTotals();
        populateSpellDropdowns();
    });
});

function updateStatTotals() {
    const statH1s = document.querySelectorAll('h1[id$="-total-h1"]');
    statH1s.forEach(statH1 => {
        const statName = statH1.id.replace(/-total-h1/, "");
        const pointBuy = document.getElementById(statName + "-h1").innerHTML;
        const other = document.getElementById(statName + "-bonus-h1").innerHTML.replace("+", "");
        const racial = document.getElementById(statName + "-racial-h1").innerHTML.replace("+", "");
        statH1.textContent = parseInt(pointBuy) + parseInt(other) + parseInt(racial);
    });
}

document.getElementById("background").addEventListener("change", function () {
    populateBackgroundSkills();
});

function populateBackgroundSkills() {
    let selectedBackground = document.getElementById("background").value;
    const backgroundData = JSON.parse(localStorage.getItem("background")).find(background => background.name == selectedBackground);
    const skillProficiencies = parseProficiencies(backgroundData.skill_proficiencies);
    const skillDropdowns = document.getElementById("skill-dropdowns");
    const backgroundSkillDropdowns = document.querySelectorAll(".background-skill-dropdown");
    backgroundSkillDropdowns.forEach(dropdown => dropdown.remove());
    const firstSelect = document.createElement("select");
    firstSelect.classList.add("background-skill-dropdown");
    const firstOption = document.createElement("option");
    firstOption.value = skillProficiencies[0];
    firstOption.textContent = skillProficiencies[0];
    firstSelect.appendChild(firstOption);
    skillDropdowns.appendChild(firstSelect);
    if (skillProficiencies.length > 1) {
        const restSelect = document.createElement("select");
        restSelect.classList.add("background-skill-dropdown");
        skillProficiencies.slice(1).forEach(skill => {
            const option = document.createElement("option");
            option.value = skill;
            option.textContent = skill;
            restSelect.appendChild(option);
        });
        skillDropdowns.appendChild(restSelect);
    }
}

function parseProficiencies(proficiencies) {
    proficiencies = proficiencies.replace(".", "");
    if (proficiencies.includes(" plus one of your choice from among")) {
        proficiencies = proficiencies.replace(" plus one of your choice from among", ", ");
    }
    if (proficiencies.includes(" plus your choice of one between")) {
        proficiencies = proficiencies.replace(" plus your choice of one between", ", ");
    }
    if (proficiencies.includes(" plus your choice of two from among")) {
        proficiencies = proficiencies.replace(" plus your choice of two from among", ", ");
    }
    if (proficiencies.includes(" and either")) {
        proficiencies = proficiencies.replace(" and either", "");
    }
    proficiencies = proficiencies.replace(" or", ",");
    proficiencies = proficiencies.replace(",,", ",");
    proficiencies = proficiencies.replace(", ,", ",");
    const proficiencyOptions = proficiencies.split(", ");
    backgroundSkills = proficiencyOptions;
    const parsedProficiencies = proficiencyOptions.map(option => [option]);
    return parsedProficiencies;
}

levelInput.addEventListener("change", function () {
    populateSkills();
    updateSpellSlots();
    populateSpellDropdowns();
});

classSelect.addEventListener("change", function (event) {
    const subclassLabel = document.querySelector("label[for='subclass']");
    let selectedClass = document.getElementById("class").value;
    subclassSelect.innerHTML = "";
    subclassSelect.style.display = "none";
    if (subclassLabel) {
        subclassLabel.style.display = "none";
    }
    const classes = JSON.parse(localStorage.getItem("class"));
    selectedClass = classes.find(thisClass => thisClass.name == event.target.value);
    if (selectedClass && selectedClass.archetypes && selectedClass.archetypes.length > 0) {
        selectedClass.archetypes.forEach(subclass => {
            const option = document.createElement("option");
            option.value = subclass.name;
            option.textContent = subclass.name;
            subclassSelect.appendChild(option);
        });
        subclassSelect.style.display = "block";
        if (subclassLabel) {
            subclassLabel.style.display = "block";
        }
    } else if (!selectedClass) {
        console.error(`Class with name ${event.target.value} not found`);
    }
});

spellcasterCheckbox.addEventListener("change", function () {
    spellcastingArea.style.minHeight = `${window.innerHeight}px`;
    spellcastingArea.style.minWidth = `${window.innerWidth}px`;
    if (spellcasterCheckbox.checked) {
        spellcastingArea.style.display = "block";
    } else {
        spellcastingArea.style.display = "none";
    }
    updateSpellSlots();
    populateSpellDropdowns();
});

const spellsByLevel = {
    "Full": { slots: [[2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]] },
    "Half": { slots: [[0], [2], [3], [3], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3, 2], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2]] },
    "Third": { slots: [[2], [3], [3], [3], [4, 2], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3], [4, 3, 2], [4, 3, 2], [4, 3, 2], [4, 3, 3], [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1]] },
    "Pact": { slots: [[1, 1], [2, 1], [2, 2], [2, 2], [2, 3], [2, 3], [2, 4], [2, 4], [2, 5], [2, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [4, 5], [4, 5], [4, 5], [4, 5]] }
}

function updateSpellSlots() {
    const slotLevels = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"];
    const currentClass = classSelect.value;
    const currentSubclass = subclassSelect.value;
    const currentLevel = parseInt(levelInput.value);
    if (currentClass == "Bard" || currentClass == "Cleric" || currentClass == "Druid" || currentClass == "Sorcerer" || currentClass == "Wizard") {
        const spellSlots = spellsByLevel.Full.slots[currentLevel - 1];
        slotLevels.forEach((level, index) => {
            const slot = document.getElementById(`${level}-level-slot-num-h1`);
            slot.textContent = spellSlots[index];
        });
    } else if (currentClass == "Paladin" || currentClass == "Ranger") {
        const spellSlots = spellsByLevel.Half.slots[currentLevel - 1];
        slotLevels.forEach((level, index) => {
            const slot = document.getElementById(`${level}-level-slot-num-h1`);
            slot.textContent = spellSlots[index];
        });
    } else if (currentSubclass == "Eldritch Knight" || currentSubclass == "Arcane Trickster") {
        const spellSlots = spellsByLevel.Third.slots[currentLevel - 1];
        slotLevels.forEach((level, index) => {
            const slot = document.getElementById(`${level}-level-slot-num-h1`);
            slot.textContent = spellSlots[index];
        });
    } else if (currentClass == "Warlock") {
        const spellSlots = spellsByLevel.Pact.slots[currentLevel - 1];
        slotLevels.forEach((level, index) => {
            const slot = document.getElementById(`${level}-level-slot-num-h1`);
            slot.textContent = spellSlots[index];
        });
    } else {
        slotLevels.forEach(level => {
            const slot = document.getElementById(`${level}-level-slot-num-h1`);
            slot.textContent = "0";
        });
    }
    slotLevels.forEach(level => {
        const slotNum = document.getElementById(`${level}-level-slot-num-h1`);
        const slot = document.getElementById(`${level}-level-slot`);
        if (slotNum.textContent == "0" || slotNum.textContent == "") {
            slot.style.display = "none";
        } else {
            slot.style.display = "block";
        }
    });
}

function getSpellCastingModifier() {
    const currentClass = classSelect.value;
    const currentSubclass = subclassSelect.value;
    if (currentClass == "Bard" || currentClass == "Sorcerer" || currentClass == "Paladin" || currentClass == "Warlock") {
        return "charisma";
    } else if (currentClass == "Cleric" || currentClass == "Druid") {
        return "wisdom";
    } else if (currentClass == "Wizard" || currentSubclass == "Eldritch Knight" || currentSubclass == "Arcane Trickster") {
        return "intelligence";
    } else {
        return "";
    }
}

function getStat(name) {
    return parseInt((name + "-h1").textContent);
}

const statsToModifiers = {
    1: -5, 2: -4, 3: -4, 4: -3,
    5: -3, 6: -2, 7: -2, 8: -1,
    9: -1, 10: 0, 11: 0, 12: 1,
    13: 1, 14: 2, 15: 2, 16: 3,
    17: 3, 18: 4, 19: 4, 20: 5
};

function populateSpellDropdowns() {
    const spellDropdowns = document.getElementById("spell-dropdowns");
    const spellDropdownsChildren = Array.from(spellDropdowns.children);
    const spells = JSON.parse(localStorage.getItem("spell"));
    let currentSpellCastingModifier = parseInt(statsToModifiers[document.getElementById(getSpellCastingModifier() + "-total-h1").textContent]);
    if (currentSpellCastingModifier < 0) {
        currentSpellCastingModifier = 0;
    }
    for (let i = Array.from(spellDropdownsChildren).length; i < (parseInt(levelInput.value) + currentSpellCastingModifier); i++) {
        const select = document.createElement("select");
        spellDropdowns.appendChild(select);
        const blank = document.createElement("option");
        blank.value = "";
        blank.textContent = "";
        select.appendChild(blank);
        spells.forEach(spell => {
            const option = document.createElement("option");
            option.value = spell.name;
            option.textContent = spell.name;
            select.appendChild(option);
        });
    }
    while (spellDropdowns.children.length > (parseInt(levelInput.value) + currentSpellCastingModifier)) {
        spellDropdowns.removeChild(spellDropdowns.lastChild);
    }
}

saveButton.addEventListener("click", function () {
    const saveData = {
        level: levelInput.value,
        characterName: characterName.value,
        race: raceSelect.value,
        subrace: subraceSelect.value,
        class: classSelect.value,
        subclass: subclassSelect.value,
        background: background.value,
        alignment: alignment.value,
        languages: languages.value,
        equipment: equipment.value,
        otherFeatures: otherFeatures.value,
        pointsUsed: pointsUsed,
        stats: {
            strength: document.getElementById("strength-h1").textContent,
            dexterity: document.getElementById("dexterity-h1").textContent,
            constitution: document.getElementById("constitution-h1").textContent,
            intelligence: document.getElementById("intelligence-h1").textContent,
            wisdom: document.getElementById("wisdom-h1").textContent,
            charisma: document.getElementById("charisma-h1").textContent,
            strengthBonus: document.getElementById("strength-bonus-h1").textContent,
            dexterityBonus: document.getElementById("dexterity-bonus-h1").textContent,
            constitutionBonus: document.getElementById("constitution-bonus-h1").textContent,
            intelligenceBonus: document.getElementById("intelligence-bonus-h1").textContent,
            wisdomBonus: document.getElementById("wisdom-bonus-h1").textContent,
            charismaBonus: document.getElementById("charisma-bonus-h1").textContent
        },
        proficiencies: Array.from(document.querySelectorAll(".skill-dropdowns select")).map(select => ({
            selected: select.value,
            options: Array.from(select.options).map(option => option.value)
        })),
        expertise: Array.from(document.querySelectorAll(".expertise-dropdowns select")).map(select => select.value),
        spellcaster: spellcasterCheckbox.checked,
        spellList: Array.from(document.querySelectorAll("#spell-dropdowns select")).map(select => select.value)
    };
    const jsonData = JSON.stringify(saveData);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    if (characterName.value) {
        link.download = `${characterName.value}.json`;
    } else {
        link.download = "character.json";
    }
    link.click();
    console.log(Array.from(document.querySelectorAll(".background-skill-dropdown")).map(select => ({
        selected: select.value,
        options: Array.from(select.options).map(option => option.value)
    })));
});

loadButton.addEventListener("click", function () {
    fileInput.click();
});

fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const jsonData = e.target.result;
        const loadData = JSON.parse(jsonData);
        levelInput.value = loadData.level;
        characterName.value = loadData.characterName;
        raceSelect.value = loadData.race;
        subraceSelect.value = loadData.subrace;
        classSelect.value = loadData.class;
        subclassSelect.value = loadData.subclass;
        background.value = loadData.background;
        alignment.value = loadData.alignment;
        languages.value = loadData.languages;
        equipment.value = loadData.equipment;
        otherFeatures.value = loadData.otherFeatures;
        pointsUsed = loadData.pointsUsed;
        document.getElementById("strength-h1").textContent = loadData.stats.strength;
        document.getElementById("dexterity-h1").textContent = loadData.stats.dexterity;
        document.getElementById("constitution-h1").textContent = loadData.stats.constitution;
        document.getElementById("intelligence-h1").textContent = loadData.stats.intelligence;
        document.getElementById("wisdom-h1").textContent = loadData.stats.wisdom;
        document.getElementById("charisma-h1").textContent = loadData.stats.charisma;
        document.getElementById("strength-bonus-h1").textContent = loadData.stats.strengthBonus;
        document.getElementById("dexterity-bonus-h1").textContent = loadData.stats.dexterityBonus;
        document.getElementById("constitution-bonus-h1").textContent = loadData.stats.constitutionBonus;
        document.getElementById("intelligence-bonus-h1").textContent = loadData.stats.intelligenceBonus;
        document.getElementById("wisdom-bonus-h1").textContent = loadData.stats.wisdomBonus;
        document.getElementById("charisma-bonus-h1").textContent = loadData.stats.charismaBonus;
        populateStatBonuses();
        updateStatTotals();
        pointsUsedElement.textContent = `Points Used: ${pointsUsed}/27`;
        const skillDropdowns = document.getElementById("skill-dropdowns");
        skillDropdowns.innerHTML = '';
        loadData.proficiencies.forEach(proficiency => {
            const select = document.createElement("select");
            select.classList.add("background-skill-dropdown");
            proficiency.options.forEach(optionValue => {
                const option = document.createElement("option");
                option.value = optionValue;
                option.textContent = optionValue;
                select.appendChild(option);
            });
            select.value = proficiency.selected;
            skillDropdowns.appendChild(select);
            proficiencyH1.textContent = "Skill Proficiencies";
        });
        const expertiseDropdowns = document.querySelectorAll(".expertise-dropdowns select");
        loadData.expertise.forEach((expertise, index) => {
            expertiseDropdowns[index].value = expertise;
            expertiseH1.textContent = "Expertise";
        });
        spellcasterCheckbox.checked = loadData.spellcaster;
        spellcasterCheckbox.dispatchEvent(new Event("change"));
        const spellDropdowns = document.querySelectorAll("#spell-dropdowns select");
        loadData.spellList.forEach((spell, index) => {
            spellDropdowns[index].value = spell;
        });
    };
    reader.readAsText(file);
});

window.onload = init;