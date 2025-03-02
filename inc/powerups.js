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
  { image: 'images/image1.jpg', title: 'Powerup 1', description: 'Description 1', chance: 10 },
  { image: 'images/image2.jpg', title: 'Powerup 2', description: 'Description 2', chance: 10 },
  { image: 'images/image3.jpg', title: 'Powerup 3', description: 'Description 3', chance: 10 },
  { image: 'images/image4.jpg', title: 'Powerup 4', description: 'Description 4', chance: 10 },
  { image: 'images/image5.jpg', title: 'Powerup 5', description: 'Description 5', chance: 10 },
  { image: 'images/image6.jpg', title: 'Powerup 6', description: 'Description 6', chance: 10 },
  { image: 'images/image7.jpg', title: 'Powerup 7', description: 'Description 7', chance: 10 },
  { image: 'images/image8.jpg', title: 'Powerup 8', description: 'Description 8', chance: 10 },
  { image: 'images/image9.jpg', title: 'Powerup 9', description: 'Description 9', chance: 10 },
  { image: 'images/image10.jpg', title: 'Powerup 10', description: 'Description 10', chance: 10 },
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
