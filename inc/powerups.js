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

function getRarity(chance) {
  if (chance <= 3) return { label: 'Legendary', cls: 'legendary' };
  if (chance <= 6) return { label: 'Epic', cls: 'epic' };
  if (chance <= 8) return { label: 'Rare', cls: 'rare' };
  return { label: 'Common', cls: 'common' };
}

function createPowerupElement(data) {
  const powerup = document.createElement('div');
  powerup.classList.add('powerup');

  // Apply rarity class
  const { cls: rarityClass, label: rarityLabel } = getRarity(data.chance);
  powerup.classList.add(rarityClass);

  // Rarity badge at top
  const badge = document.createElement('div');
  badge.classList.add('rarity-badge', rarityClass);
  badge.textContent = rarityLabel;
  powerup.appendChild(badge);

  // SVG icon
  const svg = createPowerupSVG(data.title);
  svg.setAttribute('width', '200');
  svg.setAttribute('height', '150');
  powerup.appendChild(svg);

  // Title of the powerup
  const title = document.createElement('p');
  title.classList.add('title');
  title.textContent = data.title;
  powerup.appendChild(title);

  // Type of powerup
  const type = document.createElement('p');
  type.classList.add('type');
  type.textContent = data.type;
  powerup.appendChild(type);

  // Clicking shows the full popup (with description)
  powerup.addEventListener('click', () => {
    showPopup(data, powerup);
  });

  return powerup;
}

function createPowerupSVG(title) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 200 150');

  function rect(x, y, width, height, fill, rx = 0) {
    const r = document.createElementNS(svgNS, 'rect');
    r.setAttribute('x', x);
    r.setAttribute('y', y);
    r.setAttribute('width', width);
    r.setAttribute('height', height);
    r.setAttribute('fill', fill);
    if (rx) r.setAttribute('rx', rx);
    svg.appendChild(r);
  }

  function ellipse(cx, cy, rx, ry, fill) {
    const e = document.createElementNS(svgNS, 'ellipse');
    e.setAttribute('cx', cx);
    e.setAttribute('cy', cy);
    e.setAttribute('rx', rx);
    e.setAttribute('ry', ry);
    e.setAttribute('fill', fill);
    svg.appendChild(e);
  }

  function path(d, fill = 'none', stroke = 'black', width = 2) {
    const p = document.createElementNS(svgNS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('fill', fill);
    p.setAttribute('stroke', stroke);
    p.setAttribute('stroke-width', width);
    svg.appendChild(p);
  }

  function line(x1, y1, x2, y2, stroke, width = 2, dash = false) {
    const l = document.createElementNS(svgNS, 'line');
    l.setAttribute('x1', x1);
    l.setAttribute('y1', y1);
    l.setAttribute('x2', x2);
    l.setAttribute('y2', y2);
    l.setAttribute('stroke', stroke);
    l.setAttribute('stroke-width', width);
    if (dash) l.setAttribute('stroke-dasharray', '4,2');
    svg.appendChild(l);
  }

  function circle(cx, cy, r, fill) {
    const c = document.createElementNS(svgNS, 'circle');
    c.setAttribute('cx', cx);
    c.setAttribute('cy', cy);
    c.setAttribute('r', r);
    c.setAttribute('fill', fill);
    svg.appendChild(c);
  }

  function text(str, x, y, fill, fontSize = 16, fontWeight = 'bold') {
  const t = document.createElementNS(svgNS, 'text');
  t.setAttribute('x', x);
  t.setAttribute('y', y);
  t.setAttribute('text-anchor', 'middle');
  t.setAttribute('fill', fill);
  t.setAttribute('font-size', fontSize);
  t.setAttribute('font-weight', fontWeight);
  t.setAttribute('font-family', 'Arial, sans-serif');
  t.textContent = str;
  svg.appendChild(t);
}

  switch (title) {

    // Offensive
    case '+5': {
      const text5 = document.createElementNS(svgNS, 'text');
      text5.setAttribute('x', '100');
      text5.setAttribute('y', '85');
      text5.setAttribute('text-anchor', 'middle');
      text5.setAttribute('fill', '#FFD700');
      text5.setAttribute('font-size', '48');
      text5.setAttribute('font-weight', 'bold');
      text5.setAttribute('font-family', 'Arial, sans-serif');
      text5.textContent = '+5';
      svg.appendChild(text5);
      break;
    }

    case '+10': {
      const text10 = document.createElementNS(svgNS, 'text');
      text10.setAttribute('x', '100');
      text10.setAttribute('y', '85');
      text10.setAttribute('text-anchor', 'middle');
      text10.setAttribute('fill', '#32CD32');
      text10.setAttribute('font-size', '48');
      text10.setAttribute('font-weight', 'bold');
      text10.setAttribute('font-family', 'Arial, sans-serif');
      text10.textContent = '+10';
      svg.appendChild(text10);
      break;
    }

    case 'Force Draw': {
      // Shadow
      ellipse(100, 125, 45, 10, '#00000033');

      // Card
      rect(80, 60, 40, 60, '#fff', 5);
      text('?', 100, 100, '#000', 32);

      // Glow
      path('M80,60 h40 v60 h-40 Z', 'none', '#aa44ff', 2); // Violet glow

      // Arrow
      line(155, 90, 130, 90, '#aa44ff', 4);     // Line
      line(130, 90, 138, 82, '#aa44ff', 4);     // Upper arrowhead
      line(130, 90, 138, 98, '#aa44ff', 4);     // Lower arrowhead

      // Particles
      circle(110, 70, 1.5, '#ff66cc'); // Top
      circle(115, 105, 1.8, '#cc66ff'); // Side
      circle(105, 85, 1.2, '#ff88dd'); // Mid

      break;
    }

    case 'Remove': {
      // Shadow
      ellipse(100, 125, 45, 10, '#00000033');

      // Card
      rect(80, 60, 40, 60, '#fff', 5);
      text('♣', 100, 100, '#000', 32);

      // Glow
      path('M80,60 h40 v60 h-40 Z', 'none', '#00ffff', 2); // Cyan glow

      // Minus symbol
      text('–', 120, 77, '#ff0000', 50, 'bold');

      break;
    }

    case 'Steal': {
      path(
        'M60,70 ' +
        'C65,58 135,58 140,70 ' +  // Upper arch
        'C145,82 135,92 65,92 ' +  // Lower arch
        'C55,85 55,75 60,70 Z',
        '#000'
      );

      // Eyes holes and outlines
      path(
        'M78,75 ' +
        'Q83,72 88,75 ' +
        'Q83,78 78,75 Z',
        '#fff'
      );
      path(
        'M112,75 ' +
        'Q117,72 122,75 ' +
        'Q117,78 112,75 Z',
        '#fff'
      );

      path(
        'M78,75 Q83,72 88,75 Q83,78 78,75 Z',
        'none',
        '#444',
        1
      );
      path(
        'M112,75 Q117,72 122,75 Q117,78 112,75 Z',
        'none',
        '#444',
        1
      );

      // Side Strings
      line(60, 70, 50, 65, '#000', 2);
      line(140, 70, 150, 65, '#000', 2);

      // Edge Hihglihgt
      path(
        'M60,70 C65,58 135,58 140,70',
        'none',
        '#222',
        1
      );

      break;
    }

    // Defensive
    case 'Shield': {
      // Shadow
      ellipse(100, 125, 45, 10, '#00000033'); // Shadow

      // Card
      rect(80, 60, 40, 60, '#fff', 5); // Card Shape
      text('🛡', 100, 100, '#0077ff', 32); // Shield Symbol
      path('M80,60 h40 v60 h-40 Z', 'none', '#00ccff', 2); // Cyan Outline

      // Effects
      path('M80,60 Q90,50 100,60', 'none', '#00aaff88', 1); // Top Arc
      path('M140,120 Q110,130 100,120', 'none', '#00aaff88', 1); // Bottom Arc

      // Particles
      circle(90, 65, 1.5, '#66ccff'); // Top-left
      circle(110, 70, 2, '#99ddff');  // Top-right
      circle(95, 115, 1.2, '#66ccff'); // Bottom

      break;
    }

    case 'Mirror': {
      ellipse(100, 75, 40, 60, '#888'); // Frame
      ellipse(100, 75, 35, 55, 'url(#mirrorGradient)'); // Gradient Effect
      line(85, 40, 115, 110, 'white', 1); // Line

      break;
    }

    case 'Chicken': {
      // Shadow
      ellipse(100, 125, 45, 10, '#00000033');

      // Inneer & Outer circles
      circle(100, 85, 25, '#d40000');
      circle(100, 85, 18, '#ffffff');

      // Minus sign
      text('-', 100, 93, '#00000055', 34);
      text('-', 100, 93, '#003399', 30);

      // Chip Lines
      line(100, 60, 100, 65, '#fff', 2); // Top
      line(100, 105, 100, 110, '#fff', 2); // Bottom
      line(75, 85, 80, 85, '#fff', 2); // Left
      line(120, 85, 125, 85, '#fff', 2); // Right

      break;
}

    // Utility
    case 'Invisible Hand': {
      // Card 1
      rect(30, 50, 40, 60, '#444', 5);
      text('?', 50, 90, '#fff', 32);

      // Card 2
      rect(80, 50, 40, 60, '#444', 5);
      text('?', 100, 90, '#fff', 32);

      // Card 3
      rect(130, 50, 40, 60, '#444', 5);
      text('?', 150, 90, '#fff', 32);

      // Effects
      ellipse(100, 115, 60, 10, '#00000066'); // shadow below all cards
      circle(95, 45, 1.5, '#ffffff66');
      circle(105, 40, 2, '#ffffff88');

      break;
    }

    case 'Raised Stakes': {
      // Shadow
      ellipse(100, 130, 50, 10, '#00000033');

      // Left chip
      circle(70, 105, 25, '#a60000');  // Big
      circle(70, 105, 18, '#ffffff');  // Inner

      // Middle chip
      circle(100, 105, 25, '#b80000');  // Big
      circle(100, 105, 18, '#ffffff');  // Inner

      // Top chip
      ellipse(130, 105, 25, 25, '#d40000'); // Big
      ellipse(130, 105, 18, 18, '#ffffff'); // Inner

      // Plus Sign
      text('+', 70, 113, '#00000055', 34); // Shadow Left
      text('+', 70, 113, '#003399', 30);   // Foreground Left
      
      text('+', 100, 113, '#00000055', 34); // Shadow Mid
      text('+', 100, 113, '#003399', 30);   // Foreground Mid

      text('+', 130, 113, '#00000055', 34); // Shadow Right
      text('+', 130, 113, '#003399', 30);   // Foreground Right

      break;
    }

    case 'Rewind': {
      // Shadow
      ellipse(100, 125, 45, 10, '#00000033'); // Soft shadow

      // Rewind arrow (arcane energy) - stays the same, no movement
      path('M115,60 L115,80 L85,70 L115,60 Z', 'none', '#0077ff', 3); // Top part of hourglass (right-pointing arrow)
      path('M115,90 L115,110 L85,100 L115,90 Z', 'none', '#0077ff', 3); // Bottom part of hourglass (right-pointing arrow)

      // Symbols
      path('M100,30 C90,20 110,20 100,30', 'none', '#ff00cc', 1); // Glowing symbol above
      text('✧', 90, 40, '#ff99cc', 20); // Left
      text('✧', 110, 40, '#ff99cc', 20); // Right

      // Circles
      circle(95, 45, 2, '#66ccff'); // Left
      circle(105, 45, 2, '#66ccff'); // Right

      break;
    }

    case 'Signal Jammer': {
      // Main Router
      rect(70, 90, 60, 20, '#999', 5); // Base of the router
      rect(75, 95, 50, 5, '#666'); // Router Shadow
      rect(75, 90, 5, 20, '#555'); // Left ledge of router
      rect(120, 90, 5, 20, '#555'); // Right ledge of router
      rect(80, 95, 40, 6, '#2ecc71', 4); // Green panel

      // Dots in green panel
      circle(90, 98, 1, '#ffffff'); // Left
      circle(100, 98, 1, '#ffffff'); // Center
      circle(110, 98, 1, '#ffffff'); // Right

      // Antennas
      line(75, 90, 65, 60, '#ccc', 2); // Left
      line(125, 90, 135, 60, '#ccc', 2); // Right
      circle(65, 60, 2, '#ccc'); // Left circle
      circle(135, 60, 2, '#ccc'); // Right circle

      // Wi-Fi Signal
      ellipse(100, 70, 2, 2, '#FF0000'); // Dot
      path('M90,65 A10,10 0 0,1 110,65', 'none', '#FF0000', 2);  // Smallest Wave
      path('M85,60 A15,15 0 0,1 115,60', 'none', '#FF0000', 2);  // Middle Wave
      path('M80,55 A20,20 0 0,1 120,55', 'none', '#FF0000', 2);  // Largest Wave
      line(80, 35, 118, 68, '#FF0000', 3); // Cross

      break;
    }

    case 'Sturdy Wipe': {
      // Card 1
      rect(30, 50, 40, 60, '#fff', 5); // Card shape
      path('M30,50 L45,50 Q35,70 45,90 L30,110 Z', '#1a1a1a'); // Wiped chunk
      ellipse(50, 80, 5, 5, '#ffff00'); // Center Dot
      path('M30,50 h40 v60 h-40 Z', 'none', '#ffff00', 2); // Yellow glow

      // Card 2
      rect(80, 50, 40, 60, '#fff', 5); // Card shape
      path('M80,50 h40 v60 h-40 Z', 'none', '#00ffff', 2); // Cyan Glow Outline
      ellipse(100, 80, 5, 5, '#00ffff'); // Center Dot
      path('M95,65 Q100,55 105,65 Q100,75 95,65 Z', '#00ffff'); // Symbol

      // Card 3
      rect(130, 50, 40, 60, '#fff', 5); // Card shape
      path('M130,50 h40 v60 h-40 Z', 'none', '#ff00ff', 2); // Purple Glow Outline
      ellipse(150, 80, 5, 5, '#ff00ff'); // Center Dot
      path('M145,65 L150,55 L155,65 L150,75 Z', '#ff00ff'); // Symbol

      // Particles
      circle(90, 45, 1.5, '#ffffff');
      circle(110, 115, 1.5, '#ffffff');
      circle(135, 40, 2, '#ffffff88');

      // Cloth
      path('M20,60 Q40,45 60,60 Q65,70 50,80 Q30,75 20,60 Z', '#FF6347'); // Outer
      path('M35,60 Q50,55 45,65 Q40,70 35,60 Z', '#cc3e27'); // Inner
      line(60, 65, 75, 65, '#ffffff88', 1, true); // Swipe trail

      break;
    }

    case 'Swap Hands': {
      // Shadow
      ellipse(70, 85, 45, 10, '#00000033');
      ellipse(140, 165, 45, 10, '#00000033');

      // Card 1
      rect(50, 20, 40, 60, '#fff', 5);
      text('♥', 70, 60, '#e40046', 32);

      // Card 2
      rect(120, 90, 40, 60, '#fff', 5);
      text('♠', 140, 130, '#000', 32);

      // Glowing Outlines
      path('M50,20 h40 v60 h-40 Z', 'none', '#00ffff', 2); // Cyan glow
      path('M120,90 h40 v60 h-40 Z', 'none', '#ff00ff', 2); // Purple glow

      // Arrows
      line(150, 85, 150, 40, '#888888', 4); // Top vertical
      line(150, 40, 100, 40, '#888888', 4); // Top horizontal
      
      line(70, 89, 70, 135, '#888888', 4); // Bottom vertical
      line(70, 135, 113, 135, '#888888', 4); // Bottom horizontal
      break;
    }

    default:
      rect(60, 60, 80, 30, '#666', 8);
      break;
  }

  // Mirror Gradient
  if (title === 'Mirror') {
    const defs = document.createElementNS(svgNS, 'defs');
    const grad = document.createElementNS(svgNS, 'linearGradient');
    grad.setAttribute('id', 'mirrorGradient');
    grad.setAttribute('x1', '0%');
    grad.setAttribute('x2', '100%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('y2', '100%');

    const stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#cfd8dc');
    grad.appendChild(stop1);

    const stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#90a4ae');
    grad.appendChild(stop2);

    defs.appendChild(grad);
    svg.appendChild(defs);
  }

  return svg;
}

// Popup logic
function showPopup(data, powerupElement) {
  const popup = document.getElementById('powerupPopup');
  const container = popup.querySelector('.popup-content');
  container.innerHTML = ''; // clear previous

  // Rarity-colored title at top
  const { label, cls } = getRarity(data.chance);
  const titleEl = document.createElement('h2');
  titleEl.textContent = data.title;
  titleEl.classList.add('popup-title', cls);
  container.appendChild(titleEl);

  // SVG
  const svg = createPowerupSVG(data.title);
  svg.setAttribute('width', '200');
  svg.setAttribute('height', '150');
  container.appendChild(svg);

  // Description
  const desc = document.createElement('p');
  desc.classList.add('popup-description');
  desc.textContent = data.description;
  container.appendChild(desc);

  // Buttons
  const useBtn = document.createElement('button');
  useBtn.textContent = 'Use Powerup';
  useBtn.addEventListener('click', () => {
    powerupElement.remove();
    popup.style.display = 'none';
  });
  container.appendChild(useBtn);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
  });
  container.appendChild(closeBtn);

  popup.style.display = 'flex';
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
  document.getElementById('popupRulesText').innerHTML =
    `<strong>Base Rules:</strong><br>
     1. Players start with an equal number of chips.<br>
     2. Each round, players place a bet, draw 2 cards from the physical deck just like in a normal game of black jack and draw 3 power-up cards.<br>
     3. Goal is to reach 21.<br>
     4. Players take turns until everyone agrees to finish the round.<br>
     5. In the case of a draw, all chips go into a temporary pot for which next round will be played for.<br>
     6. Game ends when only one player is left with chips.<br><br>

     <strong>Power-ups:</strong><br>
     1. Offensive powerups owned can be used only during your turn.<br>
     2. Defensive powerups owned can be used at any time including to counter an opponent's offensive power up used on you.<br>
     3. Utility powerups owned can be used only during your turn.<br>
     4. Power-ups carry over from one round to another.<br>`;
  document.getElementById('rulesPopup').style.display = 'flex';
}

function closeRulesPopup() {
  document.getElementById('rulesPopup').style.display = 'none';
}

// Powerups
const powerups = [
  { title: '+10', description: 'Add 10 to self or opponent', chance: 5, type: 'Offensive' },
  { title: '+5', description: 'Add 5 to self or opponent', chance: 8, type: 'Offensive' },
  { title: 'Chicken', description: 'Remove 1 chip from your bet', chance: 11, type: 'Defensive' },
  { title: 'Force Draw', description: 'Force opponent to draw another card', chance: 8, type: 'Offensive' },
  { title: 'Invisible Hand', description: 'Your cards are hidden next round', chance: 3, type: 'Utility' },
  { title: 'Mirror', description: 'Redirect offensive powerup back to user', chance: 7, type: 'Defensive' },
  { title: 'Raised Stakes', description: 'Force everyone to raise bets by 3 including self', chance: 9, type: 'Utility' },
  { title: 'Remove', description: 'Remove latest drawn card from opponent', chance: 9, type: 'Offensive' },
  { title: 'Rewind', description: 'Revert last action', chance: 10, type: 'Utility' },
  { title: 'Shield', description: 'Used to prevent any powerup to be used on you', chance: 9, type: 'Defensive' },
  { title: 'Signal Jammer', description: 'Block opponent powerups next round', chance: 4, type: 'Utility' },
  { title: 'Steal', description: 'Steal last drawn card from one opponent', chance: 10, type: 'Offensive' },
  { title: 'Sturdy Wipe', description: 'Make one opponent lose all the powerups that they have aquired', chance: 3, type: 'Utility' },
  { title: 'Swap Hands', description: 'Swap hands with opponent', chance: 4, type: 'Utility' },
];

// Event binding
document.getElementById('generateButton').addEventListener('click', () => {
  const data = getRandomPowerup();
  const el = createPowerupElement(data);
  document.getElementById('powerupsContainer').appendChild(el);
});
document.getElementById('rulesText').addEventListener('click', toggleRulesPopup);
document.getElementById('closeRulesButton').addEventListener('click', closeRulesPopup);
