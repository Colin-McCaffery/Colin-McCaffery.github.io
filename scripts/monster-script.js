const table = document.querySelector('table');
let rows;
let highlighted = null;
let monsters = [];

async function fetchAllMonsters(url) {
  let num = 0;
  let prev = 0;
  try {
    while (url) {
      prev = num;
      let smallMonsters = [];
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      for (let i = 0; i < data.results.length; i++) {
        if (data.results[i].page != "") {
          monsters.push(data.results[i]);
          smallMonsters.push(data.results[i]);
          num++;
        }
      }

      appendTableMonsters(smallMonsters, prev);

      url = data.next;
    }
  } catch (error) {
    console.error('Error fetching monster data:', error);
    return null;
  }
}


let spells;

function init() {

  // Check if the spells are already in local storage
  // Fetch the spells from the API
  const initialUrl = 'https://api.open5e.com/v1/monsters/?page=1';
  fetchAllMonsters(initialUrl)
    .then(allMonsters => {
      if (allMonsters) {
        console.log('All mosnters:', allMonsters);
      } else {
        console.log('No monsters fetched.');
      }
    });
}


function appendTableMonsters(monstersArray, index) {
  const tbody = table.querySelector('tbody');
  for (let i = 0; i < monstersArray.length; i++) {
    let row = document.createElement('tr');

    let tdName = document.createElement('td');
    let spanName = document.createElement('span');
    tdName.appendChild(spanName);

    let tdType = document.createElement('td');
    let spanType = document.createElement('span');
    tdType.appendChild(spanType);

    let tdCR = document.createElement('td');
    let spanCR = document.createElement('span');
    tdCR.appendChild(spanCR);

    spanName.innerHTML = monstersArray[i].name;
    spanName.classList.add('name');
    spanType.innerHTML = monstersArray[i].type;
    spanType.classList.add('type');
    spanCR.innerHTML = monstersArray[i].cr;
    spanCR.classList.add('cr');


    row.appendChild(tdName);
    row.appendChild(tdType);
    row.appendChild(tdCR);

    tbody.appendChild(row);

    rows = document.querySelectorAll('tr');

  }
  addRowEventListeners(index);
}

function addRowEventListeners(start) {
  if (start == 0) {
    start = 1;
  }
  for (let i = start; i < rows.length; i++) {
    rows[i].addEventListener("click", function (ev) {
      if (highlighted != null) {
        highlighted.classList.remove("highlight");
      }

      this.classList.add("highlight");
      highlighted = this;
      updateMonsterInfo(ev);
    });
  }
}


let monsterName = document.querySelector(".monster-name");
let monsterType = document.getElementById("monsterType");
let monsterAlignment = document.getElementById("alignment")
let monsterImg = document.querySelector(".monster-header img");

let monsterArmor = document.getElementById("armor");
let monsterHP = document.getElementById("hp");
let monsterSpeed = document.getElementById("speed");

let monsterStr = document.getElementById("str");
let monsterDex = document.getElementById("dex");
let monsterCon = document.getElementById("con");
let monsterInt = document.getElementById("int");
let monsterWis = document.getElementById("wis");
let monsterCha = document.getElementById("cha");

let skillsSpan = document.getElementById("skills-span");
let sensesSpan = document.getElementById("senses-span");
let languagesSpan = document.getElementById("languages-span");
let challengesSpan = document.getElementById("challenges-span");

let monsterDescription = document.querySelector(".monster-description");

let actionsDiv = document.querySelector(".monster-actions");
let template = document.getElementById("action-template");
let dice = document.getElementById("dice");
let source = document.querySelector('.source');


function updateMonsterInfo(ev) {
  actionsDiv.innerHTML = "";
  let rowIndex = ev.target.parentNode.rowIndex - 1;
  let monsterInfo = monsters[rowIndex];
  console.log(monsterInfo);

  monsterName.innerHTML = monsterInfo.name;
  monsterType.innerHTML = monsterInfo.type;
  if (monsterInfo.alignment != "") {
    monsterAlignment.innerHTML = monsterInfo.alignment;
  } else {
    monsterAlignment.innerHTML = "Unaligned";
  }
  if (monsterInfo.img_main != null) {
    monsterImg.src = monsterInfo.img_main;
    monsterImg.alt = "Image of " + monsterInfo.name;
  } else {
    monsterImg.src = "../images/placeholder.webp"
    monsterImg.alt = "no image available, placeholder image";
  }

  monsterArmor.innerHTML = monsterInfo.armor_class;
  monsterHP.innerHTML = monsterInfo.hit_points;
  dice.innerHTML = monsterInfo.hit_dice;

  dice.addEventListener('click', () => {
    window.location.href = `dice-roller.html?` + monsterInfo.hit_dice;
  });

  let speed = "";
  let speedKeys = Object.keys(monsterInfo.speed);
  console.log(speedKeys);
  for (let i = 0; i < speedKeys.length; i++) {
    //need to get keys
    console.log(speedKeys[i]);
    speed += speedKeys[i] + ": " + monsterInfo.speed[speedKeys[i]];
    if (i != speedKeys.length - 1) {
      speed += ", ";
    }
  }
  monsterSpeed.innerHTML = speed;

  monsterStr.innerHTML = monsterInfo.strength;
  monsterDex.innerHTML = monsterInfo.dexterity;
  monsterCon.innerHTML = monsterInfo.constitution;
  monsterInt.innerHTML = monsterInfo.intelligence;
  monsterWis.innerHTML = monsterInfo.wisdom;
  monsterCha.innerHTML = monsterInfo.charisma;

  let skills = "";
  let skillsKeys = Object.keys(monsterInfo.skills);
  if (skillsKeys.length > 0) {
    for (let i = 0; i < skillsKeys.length; i++) {
      skills += skillsKeys[i].charAt(0).toUpperCase() + skillsKeys[i].slice(1) + ": +" + monsterInfo.skills[skillsKeys[i]];
      if (i != skillsKeys.length - 1) {
        skills += ", ";
      }
    }
  } else {
    skills = "None";
  }
  skillsSpan.innerHTML = skills;

  sensesSpan.innerHTML = monsterInfo.senses;

  if (monsterInfo.languages != "") {
    languagesSpan.innerHTML = monsterInfo.languages;
  } else {
    languagesSpan.innerHTML = "None";
  }

  challengesSpan.innerHTML = monsterInfo.challenge_rating;

  for (let i = 0; i < monsterInfo.actions.length; i++) {
    let action = monsterInfo.actions[i];
    let newAction = document.createElement("p");
    let nameSpan = document.createElement("span");
    let descSpan = document.createElement("span");
    newAction.appendChild(nameSpan);
    newAction.appendChild(descSpan);
    newAction.classList.add("action");
    nameSpan.classList.add("action-name");
    descSpan.classList.add("action-desc");

    nameSpan.innerHTML = action.name + ": ";
    descSpan.innerHTML = action.desc;

    actionsDiv.appendChild(newAction);
  }

  monsterDescription.innerHTML = monsterInfo.desc.replace(/[*_]/g, '');;

  source.href = monsterInfo.document__url;
  source.innerHTML = monsterInfo.document__title;
}

init();