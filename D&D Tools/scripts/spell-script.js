const table = document.querySelector('table');
const timeSpan = document.querySelector('.time-span');
const rangeSpan = document.querySelector('.range-span');
const durationSpan = document.querySelector('.duration-span');
const classesSpan = document.querySelector('.classes-span');
const levelSpan = document.querySelector('.level-span');
const schoolSpan = document.querySelector('.school-span');
const spellDescription = document.querySelector('.spell-description');
const spellName = document.querySelector('.spell-name');
let rows;
let spells = [];


let highlighted = null;

//add a actionlistener to each row of the table that will toggle a class on that row when clicked on

function addRowEventListeners(start) {
  console.log(start);
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
      updateSpellInfo(ev);
    });
  }
}




async function fetchClassInfo(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching class info:', error);
  }
}

let source = document.querySelector('.source');

function updateSpellInfo(ev) {

  let rowIndex = ev.target.parentNode.rowIndex - 1;
  let classInfoDiv = document.getElementById('class-info');
  let spellInfo = spells[rowIndex];
  let spell = highlighted.children;
  let url = 'https://www.dnd5eapi.co/api/classes/'
  let classInfo = [];
  let classes = spellInfo.dnd_class.split(', ');
  console.log(classes);
  classInfoDiv.innerHTML = '';

  for (let i = 0; i < classes.length; i++) {
    if (classes[i].toLowerCase().includes('barbarian') ||
      classes[i].toLowerCase().includes('bard') ||
      classes[i].toLowerCase().includes('cleric') ||
      classes[i].toLowerCase().includes('druid') ||
      classes[i].toLowerCase().includes('fighter') ||
      classes[i].toLowerCase().includes('monk') ||
      classes[i].toLowerCase().includes('paladin') ||
      classes[i].toLowerCase().includes('ranger') ||
      classes[i].toLowerCase().includes('rogue') ||
      classes[i].toLowerCase().includes('sorcerer') ||
      classes[i].toLowerCase().includes('warlock') ||
      classes[i].toLowerCase().includes('wizard')) {

      fetchClassInfo(url + classes[i].toLowerCase())
        .then(data => {
          if (data) {
            console.log('Class Info:', data);
            classInfo.push(data);
            if (classInfo.length == classes.length) {
              console.log(classInfo);
              for (let i = 0; i < classInfo.length; i++) {
                let classDiv = document.createElement('div');
                classDiv.classList.add('class-div');
                let className = document.createElement('p');
                let nameStrong = document.createElement('strong');
                className.appendChild(nameStrong);
                nameStrong.innerHTML = classInfo[i].name + ':';
                let classDescription = document.createElement('p');
                let description = 'Proficiencies: ';
                for (let j = 0; j < classInfo[i].proficiencies.length; j++) {
                  description += classInfo[i].proficiencies[j].name + ', ';
                }
                let classSubclass = document.createElement('p');

                let subclasses = 'Subclasses: ';

                for (let j = 0; j < classInfo[i].subclasses.length; j++) {
                  subclasses += classInfo[i].subclasses[j].name + ', ';
                }

                classSubclass.innerHTML = subclasses.substring(0, subclasses.length - 2);



                classDescription.innerHTML = description.substring(0, description.length - 2);
                classDiv.appendChild(className);
                classDiv.appendChild(classDescription);
                classDiv.appendChild(classSubclass);
                classInfoDiv.appendChild(classDiv);
              }
            }
          } else {
            console.log('No class info fetched.');
          }
        });
    } else {
      classes.splice(i, 1);
      console.log('spliced', classes);
    }
  }



  spellName.innerHTML = spell[0].innerHTML;
  schoolSpan.innerHTML = spell[1].innerHTML;
  levelSpan.innerHTML = spell[2].innerHTML;
  timeSpan.innerHTML = spell[3].innerHTML;
  rangeSpan.innerHTML = spell[4].innerHTML;

  const tbody = table.querySelector('tbody');
  console.log(rowIndex);


  spellDescription.innerHTML = spellInfo.desc.replace(/[*_]/g, '');;
  durationSpan.innerHTML = spellInfo.duration;
  classesSpan.innerHTML = spellInfo.dnd_class;

  source.href = spellInfo.document__url;
  source.innerHTML = spellInfo.document__title;

}

// Function to fetch data from the API
async function fetchAllSpells(url) {
  let num = 0;
  let prev = 0;
  try {
    while (url) {
      prev = num;
      let smallSpells = [];
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      for (let i = 0; i < data.results.length; i++) {
        if (data.results[i].page != "") {
          spells.push(data.results[i]);
          smallSpells.push(data.results[i]);
          num++;
        }
      }
      console.log(prev);
      appendTable(smallSpells, prev);

      url = data.next;
    }

    return spells;
  } catch (error) {
    console.error('Error fetching spell data:', error);
    return null;
  }
}

function init() {

  // Check if the spells are already in local storage
  if (localStorage.getItem('spells') != null) {
    spells = JSON.parse(localStorage.getItem('spells'));
    appendTable(spells, 0);
  } else {
    // Fetch the spells from the API
    const initialUrl = 'https://api.open5e.com/v1/spells/?page=1';
    fetchAllSpells(initialUrl)
      .then(allSpells => {
        if (allSpells) {
          console.log('All spells:', allSpells);
          spells = allSpells;
          localStorage.setItem('spells', JSON.stringify(spells));
        } else {
          console.log('No spells fetched.');
        }
      });
  }
}


function appendTable(spellsArray, index) {
  const tbody = table.querySelector('tbody');
  for (let i = 0; i < spellsArray.length; i++) {
    let row = document.createElement('tr');

    let tdName = document.createElement('td');
    let spanName = document.createElement('span');
    tdName.appendChild(spanName);

    let tdSchool = document.createElement('td');
    let spanSchool = document.createElement('span');
    tdSchool.appendChild(spanSchool);

    let tdLevel = document.createElement('td');
    let spanLevel = document.createElement('span');
    tdLevel.appendChild(spanLevel);

    let tdTime = document.createElement('td');
    let spanTime = document.createElement('span');
    tdTime.appendChild(spanTime);

    let tdRange = document.createElement('td');
    let spanRange = document.createElement('span');
    tdRange.appendChild(spanRange);

    spanName.innerHTML = spellsArray[i].name;
    spanName.classList.add('spell-name');
    spanSchool.innerHTML = spellsArray[i].school;

    /*
    Abjuration: Blue
    Conjuration: Yellow
    Divination: Gray
    Enchantment: Pink
    Evocation: Red
    Illusion: Purple
    Necromancy: Green
    Transmutation: Orange
    */
    switch (spellsArray[i].school) {
      case 'Abjuration':
        spanSchool.classList.add('abjuration');
        break;
      case 'Conjuration':
        spanSchool.classList.add('conjuration');
        break;
      case 'Divination':
        spanSchool.classList.add('divination');
        break;
      case 'Enchantment':
        spanSchool.classList.add('enchantment');
        break;
      case 'Evocation':
        spanSchool.classList.add('evocation');
        break;
      case 'Illusion':
        spanSchool.classList.add('illusion');
        break;
      case 'Necromancy':
        spanSchool.classList.add('necromancy');
        break;
      case 'Transmutation':
        spanSchool.classList.add('transmutation');
        break;
    }


    spanLevel.innerHTML = spellsArray[i].level;
    spanTime.innerHTML = spellsArray[i].casting_time;
    spanRange.innerHTML = spellsArray[i].range;

    row.appendChild(tdName);
    row.appendChild(tdSchool);
    row.appendChild(tdLevel);
    row.appendChild(tdTime);
    row.appendChild(tdRange);

    tbody.appendChild(row);

    rows = document.querySelectorAll('tr');
  }
  addRowEventListeners(index);

}

init();