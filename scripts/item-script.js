const magicTable = document.querySelector('.magicTable');
const mundaneTable = document.querySelector('.mundaneTable')
let magicRows;
let mundaneRows;
let armor = [];
let weapons = [];
let magicItems = [];
let highlightedMagic = null;
let highlightedMundane = null;
let mundaneItems = [];
let mundaneOn = false;


async function fetchArmor(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    for (let i = 0; i < data.results.length; i++) {
      data.results[i].type = "armor";
      armor.push(data.results[i]);
    }
    mundaneItems = mundaneItems.concat(armor);
    appendMundaneTable(armor, 'armor');
    return armor;
  } catch (error) {
    console.error('error fetching armor data', error);
  }
}

async function fetchWeapons(url) {
  try {
    while (url) {
      let smallWeapons = []
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      for (let i = 0; i < data.results.length; i++) {
        data.results[i].type = "weapon";
        weapons.push(data.results[i]);
        smallWeapons.push(data.results[i]);
      }
      mundaneItems = mundaneItems.concat(smallWeapons);
      appendMundaneTable(smallWeapons, 'weapons')
      url = data.next;
    }
    return weapons;
  } catch (error) {
    console.error('error fetching weapon data', error);
  }
}


async function fetchAllMagicItems(url) {
  let num = 0;
  let prev = 0;
  try {
    while (url) {
      prev = num
      let smallItems = [];
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      for (let i = 0; i < data.results.length; i++) {
        magicItems.push(data.results[i]);
        smallItems.push(data.results[i]);
        num++
      }
      appendMagicTableItems(smallItems, prev);
      url = data.next;
    }
    return magicItems;
  } catch (error) {
    console.error('Error fetching items data:', error);
    return null;
  }
}

function init() {
  let button = document.getElementById('toggle-button');
  button.addEventListener('click', function () {
    let magicTable = document.querySelector('.magic-table-container');
    let magicInfo = document.querySelector('.magic-info');
    let mundaneTable = document.querySelector('.mundane-table-container');
    let mundaneInfo = document.querySelector('.mundane-info');
    if (mundaneOn) {
      button.innerHTML = "View Mundane Items";
      mundaneOn = false;
      mundaneTable.classList.toggle('hide');
      mundaneInfo.classList.toggle('hide');
      magicTable.classList.toggle('hide');
      magicInfo.classList.toggle('hide');
    } else {
      button.innerHTML = "View Magic Items";
      mundaneOn = true;
      magicTable.classList.toggle('hide');
      magicInfo.classList.toggle('hide');
      mundaneTable.classList.toggle('hide');
      mundaneInfo.classList.toggle('hide');
    }
  })

  const magicURL = 'https://api.open5e.com/v1/magicitems/?page=1';
  const weaponURL = 'https://api.open5e.com/v1/weapons/?page=1';
  const armorURL = 'https://api.open5e.com/v1/armor/?page=1';
  fetchAllMagicItems(magicURL)
    .then(magicitems => {
      if (magicitems) {
        console.log('Magic Items:', magicitems);
      } else {
        console.log('No magic items fetched.');
      }
    });
  fetchArmor(armorURL)
    .then(armorItems => {
      if (armorItems) {
        console.log('Armor:', armorItems);
      } else {
        console.log('No armor fetched');
      }
    })
  fetchWeapons(weaponURL)
    .then(weaponItems => {
      if (weaponItems) {
        console.log('Weapons:', weaponItems);
      } else {
        console.log('No weapons fetched');
      }
    })
}


function appendMagicTableItems(itemsArray, index) {
  const tbody = magicTable.querySelector('tbody');
  for (let i = 0; i < itemsArray.length; i++) {
    let row = document.createElement('tr');

    let tdName = document.createElement('td');
    let spanName = document.createElement('span');
    tdName.appendChild(spanName);

    let tdType = document.createElement('td');
    let spanType = document.createElement('span');
    tdType.appendChild(spanType);

    let tdRarity = document.createElement('td');
    let spanRarity = document.createElement('span');
    tdRarity.appendChild(spanRarity);

    spanName.innerHTML = itemsArray[i].name;
    spanType.innerHTML = itemsArray[i].type;
    spanRarity.innerHTML = itemsArray[i].rarity.charAt(0).toUpperCase() + itemsArray[i].rarity.slice(1);

    switch (itemsArray[i].rarity.toLowerCase()) {
      case "common":
        spanRarity.classList.add("common");
        break;
      case "uncommon":
        spanRarity.classList.add("uncommon");
        break;
      case "rare":
        spanRarity.classList.add("rare");
        break;
      case "very rare":
        spanRarity.classList.add("very-rare");
        break;
      case "legendary":
        spanRarity.classList.add("legendary");
        break;
      case "artifact":
        spanRarity.classList.add("artifact");
        break;
    }
    row.appendChild(tdName);
    row.appendChild(tdType);
    row.appendChild(tdRarity);
    tbody.appendChild(row);

  }
  magicRows = magicTable.querySelectorAll('tr');
  addRowEventListenersMagic(index);
}


function appendMundaneTable(itemsArray) {
  const tbody = document.querySelector(".mundaneTable");
  for (let i = 0; i < itemsArray.length; i++) {
    let row = document.createElement('tr');

    let tdName = document.createElement('td');
    let spanName = document.createElement('span');
    tdName.appendChild(spanName);

    let tdType = document.createElement('td');
    let spanType = document.createElement('span');
    tdType.appendChild(spanType);

    let tdWeight = document.createElement('td')
    let spanWeight = document.createElement('span');
    tdWeight.appendChild(spanWeight);

    let tdCost = document.createElement('td');
    let spanCost = document.createElement('span');
    tdCost.appendChild(spanCost);

    spanName.innerHTML = itemsArray[i].name;
    spanType.innerHTML = itemsArray[i].category;
    if (itemsArray[i].weight != "") {
      spanWeight.innerHTML = itemsArray[i].weight;
    } else {
      spanWeight.innerHTML = "N/A";
    }
    spanCost.innerHTML = itemsArray[i].cost;

    row.appendChild(tdName);
    row.appendChild(tdType);
    row.appendChild(tdWeight);
    row.appendChild(tdCost);

    tbody.appendChild(row);
  }
  mundaneRows = mundaneTable.querySelectorAll('tr');
  addRowEventListenersMundane();
}

function addRowEventListenersMagic(start) {
  if (start == 0) {
    start = 1;
  }
  for (let i = start; i < magicRows.length; i++) {
    magicRows[i].addEventListener('click', function (ev) {
      if (highlightedMagic != null) {
        highlightedMagic.classList.remove("highlight");
      }
      this.classList.add('highlight');
      highlightedMagic = this;
      updateMagicInfo(ev);
    })
  }
}

function addRowEventListenersMundane() {
  for (let i = 0; i < mundaneRows.length; i++) {
    mundaneRows[i].addEventListener('click', function (ev) {
      if (highlightedMundane != null) {
        highlightedMundane.classList.remove('highlight');
      }
      this.classList.add('highlight');
      highlightedMundane = this;
      updateMundaneInfo(ev);
    })
  }
}

let magicDescription = document.querySelector('.item-description-magic');
let magicName = document.querySelector('.item-name-magic');
let magicRarity = document.querySelector('.rarity-span');
let magicSource = document.querySelector('.magic-source');
let magicType = document.querySelector('.type-span')

let mundaneName = document.querySelector('.item-name-mundane');
let mundaneCost = document.querySelector('.cost-span-mundane');
let mundaneWeight = document.querySelector('.weight-span');
let mundaneCategory = document.querySelector('.category-span');
let mundaneSource = document.querySelector('.mundane-source');

function updateMagicInfo() {
  let index = highlightedMagic.rowIndex - 1;
  let item = magicItems[index];
  magicName.innerHTML = item.name;
  magicRarity.innerHTML = item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1);
  console.log(item.rarity.toLowerCase());

  magicRarity.classList.remove("common");
  magicRarity.classList.remove("uncommon");
  magicRarity.classList.remove("rare");
  magicRarity.classList.remove("very-rare");
  magicRarity.classList.remove("legendary");
  magicRarity.classList.remove("artifact");
  switch (item.rarity.toLowerCase()) {
    case "common":
      magicRarity.classList.add("common");
      break;
    case "uncommon":
      magicRarity.classList.add("uncommon");
      break;
    case "rare":
      magicRarity.classList.add("rare");
      break;
    case "very rare":
      magicRarity.classList.add("very-rare");
      break;
    case "legendary":
      magicRarity.classList.add("legendary");
      break;
    case "artifact":
      magicRarity.classList.add("artifact");
      break;
  }

  magicDescription.innerHTML = item.desc.replace(/[*_]/g, '');
  magicSource.href = item.document__url;
  magicSource.innerHTML = item.document__title;
  magicType.innerHTML = item.type;
}


function updateMundaneInfo() {
  let index = highlightedMundane.rowIndex - 1;
  let item = mundaneItems[index];
  console.log(item);
  mundaneName.innerHTML = item.name;
  mundaneCost.innerHTML = item.cost;
  mundaneWeight.innerHTML = item.weight;
  mundaneCategory.innerHTML = item.category;

  mundaneSource.href = item.document__url;
  mundaneSource.innerHTML = item.document__title;
}

init();