// Function to generate a random powerup based on chances
function getRandomPowerup() {
  const totalChance = powerups.reduce((total, powerup) => total + powerup.chance, 0);
  const randomNum = Math.random() * totalChance;

  let accumulatedChance = 0;
  for (let i = 0; i < powerups.length; i++) {
    accumulatedChance += powerups[i].chance;
    if (randomNum < accumulatedChance) {
      return powerups[i];
    }
  }
}

// Create the powerup element
function createPowerupElement(data) {
  const powerup = document.createElement('div');
  powerup.classList.add('powerup');
  powerup.style.backgroundImage = `url(${data.image})`;

  const title = document.createElement('p');
  title.classList.add('title');
  title.textContent = data.title;

  const description = document.createElement('p');
  description.classList.add('description');
  description.textContent = data.description;

  powerup.appendChild(title);
  powerup.appendChild(description);

  powerup.addEventListener('click', () => {
    showPopup(data, powerup);
    description.style.display = 'none';
  });

  return powerup;
}

// Popup logic
function showPopup(data, powerupElement) {
  popupImage.src = data.image;
  popupDescription.textContent = data.description;
  powerupPopup.style.display = 'flex';

  currentPowerupElement = powerupElement;

  useButton.onclick = function() {
    removePowerup();
    closePopup();
  };
  
  closeButton.onclick = closePopup;
}

function closePopup() {
  powerupPopup.style.display = 'none';
  if (currentPowerupElement) {
    const powerupDescription = currentPowerupElement.querySelector('p:last-child');
    if (powerupDescription) {
      powerupDescription.style.display = 'block';
    }
  }
}

function removePowerup() {
  if (currentPowerupElement) {
    currentPowerupElement.remove();
  }
}

// Rules Popup logic
function toggleRulesPopup() {
  rulesPopup.style.display = 'flex';
}

function closeRulesPopup() {
  rulesPopup.style.display = 'none';
}

// Powerups
const powerups = [
  { image: 'images/image1.jpg', title: 'Sturdy Wipe', description: 'All active powerups get ignored', chance: 1 },
  { image: 'images/image2.jpg', title: 'Shield', description: 'Used to prevent any powerup to be used on you', chance: 5},
  { image: 'images/image3.jpg', title: 'Mirror', description: 'After someone uses an offensive powerup use this to redirect the effect back to them', chance: 3 },
  { image: 'images/image4.jpg', title: '+5', description: 'Make either self or opponent to add 5 to total by end of round', chance: 10 },
  { image: 'images/image5.jpg', title: '+10', description: 'Make either self or opponent to add 10 to total by end of round', chance: 5 },
  { image: 'images/image6.jpg', title: 'Remove', description: 'Make either self or opponent to get rid of latest drawn card', chance: 5 },
  { image: 'images/image7.jpg', title: 'Force Draw', description: 'Force and opponent to draw another card', chance: 5 },
  { image: 'images/image8.jpg', title: 'Swap Hands', description: 'Choose opponent to swap hands with', chance: 5 },
  { image: 'images/image9.jpg', title: 'Rewind', description: 'The latest action such as card draws or power up use will be reverted', chance: 5 },
  { image: 'images/image10.jpg', title: 'Steal', description: 'Choose on opponent that you want to steal their latest card from', chance: 10 },
  { image: 'images/image11.jpg', title: 'Signal Jammer', description: 'Prevent 1 opponent to use any powerup for duration of next round', chance: 10 },
  { image: 'images/image12.jpg', title: 'Invisible Hand', description: 'For duratoin of next round all your cards will be hidden from every opponent', chance: 10 },
];

// DOM elements
const generateButton = document.getElementById('generateButton');
const powerupsContainer = document.getElementById('powerupsContainer');
const powerupPopup = document.getElementById('powerupPopup');
const popupImage = document.getElementById('popupImage');
const popupDescription = document.getElementById('popupDescription');
const useButton = document.getElementById('useButton');
const closeButton = document.getElementById('closeButton');
const rulesText = document.getElementById('rulesText');
const rulesPopup = document.getElementById('rulesPopup');
const closeRulesButton = document.getElementById('closeRulesButton');

let currentPowerupElement;

// Powerup generation
generateButton.addEventListener('click', () => {
  const powerupData = getRandomPowerup();
  const powerupElement = createPowerupElement(powerupData);

  powerupsContainer.appendChild(powerupElement);
});

// Rules Popup
rulesText.addEventListener('click', toggleRulesPopup);
closeRulesButton.addEventListener('click', closeRulesPopup);
