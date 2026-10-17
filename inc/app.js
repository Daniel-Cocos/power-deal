// Multiplayer rooms.
// The player who creates a room is the host: their browser holds the game state
// and everyone else connects straight to it over WebRTC (PeerJS). The join code
// is the host's PeerJS id without the prefix, so no server of our own is needed.

const PEER_PREFIX = 'power-deal-room-';
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no look-alikes (0/O, 1/I/L)
const CODE_LENGTH = 5;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 8;
const DEFAULT_MAX_PLAYERS = 4;
const LOG_LIMIT = 50;
const JOIN_TIMEOUT_MS = 15000;

// STUN lets most players connect directly across networks. Players behind strict
// NATs (some mobile carriers, corporate networks) also need a TURN relay. Add one
// here if that happens, e.g. a free account from https://www.metered.ca/stun-turn
const PEER_OPTIONS = {
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  },
};

// Storage helpers (storage can be unavailable, e.g. in private windows)
function storageGet(storage, key) {
  try { return storage.getItem(key); } catch { return null; }
}
function storageSet(storage, key, value) {
  try { storage.setItem(key, value); } catch { /* ignore */ }
}

// Per-tab id, kept across refreshes so a player can rejoin with their powerups
const myId = storageGet(sessionStorage, 'power-deal-client-id') || crypto.randomUUID();
storageSet(sessionStorage, 'power-deal-client-id', myId);

let peer = null;      // our PeerJS instance
let isHost = false;
let state = null;     // room state (authoritative on host, a copy on clients)
let hostConn = null;  // client: connection to the host
const connections = new Map(); // host: connection -> player id
let lastSeenLogId = 0;
let joinTimeout = null;

const $ = id => document.getElementById(id);

// ---------- Helpers ----------

function randomCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
  return Array.from(bytes, b => CODE_CHARS[b % CODE_CHARS.length]).join('');
}

function normalizeCode(code) {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CODE_LENGTH);
}

function cleanName(name) {
  return String(name || '').trim().slice(0, 20) || 'Player';
}

function inviteLink(code) {
  return `${location.origin}${location.pathname}?room=${code}`;
}

function findPlayer(id) {
  return state.players.find(p => p.id === id);
}

// ---------- Host: game state ----------

function newPlayer(id, name) {
  return { id, name, connected: true, cards: [] };
}

// extra: { kind, by, title } for powerup plays, which show a toast to the others
function addLog(text, extra = {}) {
  state.nextLogId = (state.nextLogId || 0) + 1;
  state.log.push({ id: state.nextLogId, text, ...extra });
  if (state.log.length > LOG_LIMIT) state.log.shift();
}

function broadcast() {
  for (const conn of connections.keys()) {
    if (conn.open) conn.send({ type: 'state', state });
  }
  render();
}

// Applies an action from a player (the host's own actions go through here too)
function applyAction(playerId, msg) {
  const player = findPlayer(playerId);
  if (!player || !msg) return;

  switch (msg.type) {
    case 'draw': {
      state.nextUid = (state.nextUid || 0) + 1;
      player.cards.push({ uid: state.nextUid, title: getRandomPowerup().title });
      addLog(`${player.name} drew a powerup`);
      break;
    }
    case 'use': {
      const index = player.cards.findIndex(c => c.uid === msg.uid);
      if (index === -1) return;
      const [card] = player.cards.splice(index, 1);
      addLog(`${player.name} used ${card.title}`, { kind: 'use', by: player.id, title: card.title });
      break;
    }
    case 'discard': {
      if (player.cards.length === 0) return;
      player.cards = [];
      addLog(`${player.name} discarded all their powerups`);
      break;
    }
    case 'leave': {
      removePlayer(playerId);
      addLog(`${player.name} left the room`);
      break;
    }
    case 'setMax': {
      if (playerId !== state.hostId) return;
      const max = Number(msg.max);
      if (!Number.isInteger(max)) return;
      state.maxPlayers = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, state.players.length, max));
      addLog(`Max players set to ${state.maxPlayers}`);
      break;
    }
    case 'kick': {
      if (playerId !== state.hostId || msg.id === state.hostId) return;
      const target = findPlayer(msg.id);
      if (!target) return;
      for (const [conn, id] of connections) {
        if (id === target.id) {
          conn.send({ type: 'error', message: 'You were removed from the room by the host.' });
          setTimeout(() => conn.close(), 500);
        }
      }
      removePlayer(target.id);
      addLog(`${target.name} was removed by the host`);
      break;
    }
    default:
      return;
  }
  broadcast();
}

function removePlayer(id) {
  state.players = state.players.filter(p => p.id !== id);
  for (const [conn, connId] of connections) {
    if (connId === id) connections.delete(conn);
  }
}

function handleHello(conn, msg) {
  const id = String(msg.clientId || '');
  if (!id || id === state.hostId) {
    conn.send({ type: 'error', message: 'Invalid join request.' });
    setTimeout(() => conn.close(), 500);
    return;
  }

  const name = cleanName(msg.name);
  const existing = findPlayer(id);

  if (existing) {
    // Same player reconnecting (e.g. after a refresh): give them their seat back
    for (const [oldConn, connId] of connections) {
      if (connId === id && oldConn !== conn) {
        connections.delete(oldConn);
        oldConn.send({ type: 'error', message: 'You joined this room from somewhere else.' });
        setTimeout(() => oldConn.close(), 500);
      }
    }
    existing.name = name;
    existing.connected = true;
    connections.set(conn, id);
    addLog(`${name} rejoined`);
  } else {
    if (state.players.length >= state.maxPlayers) {
      conn.send({ type: 'error', message: `This room is full (${state.maxPlayers} players).` });
      setTimeout(() => conn.close(), 500);
      return;
    }
    state.players.push(newPlayer(id, name));
    connections.set(conn, id);
    addLog(`${name} joined`);
  }
  broadcast();
}

function handleIncoming(conn) {
  conn.on('data', msg => {
    if (!msg || typeof msg !== 'object') return;
    if (msg.type === 'hello') {
      handleHello(conn, msg);
      return;
    }
    const playerId = connections.get(conn);
    if (playerId) applyAction(playerId, msg);
  });

  const onClosed = () => {
    const playerId = connections.get(conn);
    if (!playerId) return;
    connections.delete(conn);
    const player = findPlayer(playerId);
    if (player) {
      player.connected = false;
      addLog(`${player.name} disconnected`);
      broadcast();
    }
  };
  conn.on('close', onClosed);
  conn.on('error', onClosed);
}

function createRoom(name, maxPlayers, attempt = 0) {
  showStatus('Creating room…');
  const code = randomCode();
  const p = new Peer(PEER_PREFIX + code, PEER_OPTIONS);
  peer = p;

  p.on('open', () => {
    if (peer !== p) return;
    isHost = true;
    state = {
      code,
      maxPlayers,
      hostId: myId,
      players: [newPlayer(myId, name)],
      log: [],
    };
    addLog(`${name} created the room`);
    enterRoom();
  });

  p.on('connection', conn => {
    if (peer === p) handleIncoming(conn);
  });

  // Lost the PeerJS server (not the players): reconnect so new players can still join
  p.on('disconnected', () => {
    if (peer === p && !p.destroyed) p.reconnect();
  });

  p.on('error', err => {
    if (peer !== p) return;
    if (err.type === 'unavailable-id' && !state && attempt < 5) {
      p.destroy();
      createRoom(name, maxPlayers, attempt + 1);
      return;
    }
    if (state) {
      console.warn('PeerJS error', err); // non-fatal once the room is running
      return;
    }
    fail(`Could not create the room (${err.type}). Please try again.`);
  });
}

// ---------- Client ----------

function joinRoom(name, code) {
  showStatus('Connecting to room…');
  const p = new Peer(PEER_OPTIONS);
  peer = p;

  p.on('open', () => {
    if (peer !== p) return;
    const conn = p.connect(PEER_PREFIX + code, { reliable: true });
    hostConn = conn;
    joinTimeout = setTimeout(() => {
      fail('Could not reach the room. Check the code, or the host may be on a network that blocks direct connections.');
    }, JOIN_TIMEOUT_MS);

    conn.on('open', () => {
      if (peer !== p) return;
      conn.send({ type: 'hello', name, clientId: myId });
    });

    conn.on('data', msg => {
      if (peer !== p || !msg) return;
      if (msg.type === 'state') {
        clearTimeout(joinTimeout);
        const first = !state;
        state = msg.state;
        if (first) {
          lastSeenLogId = state.nextLogId || 0;
          history.replaceState(null, '', `?room=${code}`);
          enterRoom();
        } else {
          render();
        }
      } else if (msg.type === 'error') {
        fail(msg.message);
      }
    });

    conn.on('close', () => {
      if (peer === p) fail('Lost connection to the host. The room may have been closed.');
    });
  });

  p.on('error', err => {
    if (peer !== p) return;
    if (err.type === 'peer-unavailable') {
      fail(`No room found with code ${code}.`);
    } else if (!state) {
      fail(`Could not connect (${err.type}). Please try again.`);
    } else {
      console.warn('PeerJS error', err);
    }
  });
}

// Sends an action to the host (or applies it directly if we are the host)
function send(msg) {
  if (isHost) applyAction(myId, msg);
  else if (hostConn && hostConn.open) hostConn.send(msg);
}

// ---------- Session lifecycle ----------

// destroyDelay gives final messages a moment to go out before the connection closes
function cleanup(destroyDelay = 0) {
  clearTimeout(joinTimeout);
  const p = peer;
  peer = null;
  if (p) setTimeout(() => p.destroy(), destroyDelay);
  isHost = false;
  state = null;
  hostConn = null;
  connections.clear();
  lastSeenLogId = 0;
}

function leaveRoom() {
  if (isHost) {
    if (!confirm('Leaving will close the room for everyone. Leave anyway?')) return;
    for (const conn of connections.keys()) {
      if (conn.open) conn.send({ type: 'error', message: 'The host closed the room.' });
    }
  } else {
    send({ type: 'leave' });
  }
  cleanup(300);
  history.replaceState(null, '', location.pathname);
  showMenu();
}

function fail(message) {
  cleanup();
  showMenu();
  showStatus(message, true);
}

// ---------- UI ----------

function showStatus(text, withButton = false) {
  $('statusText').textContent = text;
  $('statusButton').hidden = !withButton;
  $('statusPopup').style.display = 'flex';
}

function hideStatus() {
  $('statusPopup').style.display = 'none';
}

function showMenu() {
  $('roomScreen').hidden = true;
  $('menuScreen').hidden = false;
  $('powerupPopup').style.display = 'none';
}

function enterRoom() {
  hideStatus();
  $('menuScreen').hidden = true;
  $('roomScreen').hidden = false;
  render();
}

function fillMaxPlayersSelect(select, min, value) {
  select.innerHTML = '';
  for (let n = min; n <= MAX_PLAYERS; n++) {
    const option = document.createElement('option');
    option.value = n;
    option.textContent = n;
    select.appendChild(option);
  }
  select.value = value;
}

function render() {
  if (!state) return;
  const me = findPlayer(myId);

  $('roomCode').textContent = state.code;
  $('playerCount').textContent = `(${state.players.length}/${state.maxPlayers})`;

  // Players
  const list = $('playerList');
  list.innerHTML = '';
  for (const player of state.players) {
    const li = document.createElement('li');
    li.classList.toggle('offline', !player.connected);

    const name = document.createElement('span');
    name.classList.add('player-name');
    name.textContent = player.name;
    li.appendChild(name);

    const tags = [];
    if (player.id === myId) tags.push('you');
    if (player.id === state.hostId) tags.push('host');
    if (!player.connected) tags.push('offline');
    if (tags.length) {
      const tag = document.createElement('span');
      tag.classList.add('muted');
      tag.textContent = ` (${tags.join(', ')})`;
      li.appendChild(tag);
    }

    const count = document.createElement('span');
    count.classList.add('card-count');
    count.textContent = `${player.cards.length} 🃏`;
    count.title = `${player.cards.length} powerup${player.cards.length === 1 ? '' : 's'}`;
    li.appendChild(count);

    if (isHost && player.id !== myId) {
      const kick = document.createElement('button');
      kick.classList.add('small', 'secondary');
      kick.textContent = 'Remove';
      kick.addEventListener('click', () => {
        if (confirm(`Remove ${player.name} from the room?`)) send({ type: 'kick', id: player.id });
      });
      li.appendChild(kick);
    }
    list.appendChild(li);
  }

  // Host controls
  $('hostControls').hidden = !isHost;
  if (isHost) {
    fillMaxPlayersSelect($('roomMaxPlayers'), Math.max(MIN_PLAYERS, state.players.length), state.maxPlayers);
  }

  // Your powerups
  const container = $('powerupsContainer');
  container.innerHTML = '';
  const cards = me ? me.cards : [];
  for (const card of cards) {
    const data = getPowerup(card.title);
    if (!data) continue;
    container.appendChild(createPowerupElement(data, () => {
      showPopup(data, () => send({ type: 'use', uid: card.uid }));
    }));
  }
  $('emptyHand').hidden = cards.length > 0;
  $('discardButton').hidden = cards.length === 0;

  // Activity log, newest first
  const log = $('activityLog');
  log.innerHTML = '';
  for (const entry of [...state.log].reverse()) {
    const li = document.createElement('li');
    li.textContent = entry.text;
    if (entry.kind === 'use') li.classList.add('used');
    log.appendChild(li);
  }

  // Let everyone know when someone else plays a powerup
  for (const entry of state.log) {
    if (entry.id > lastSeenLogId && entry.kind === 'use' && entry.by !== myId) {
      showToast(entry);
    }
  }
  lastSeenLogId = state.nextLogId || 0;
}

function showToast(entry) {
  const data = getPowerup(entry.title);
  const toast = document.createElement('div');
  toast.classList.add('toast');
  if (data) toast.classList.add(getRarity(data.chance).cls);
  toast.textContent = entry.text + (data ? ` - ${data.description}` : '');
  if (data) toast.addEventListener('click', () => showPopup(data));
  $('toasts').appendChild(toast);
  setTimeout(() => toast.remove(), 6000);
}

async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    const original = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => { button.textContent = original; }, 1500);
  } catch {
    prompt('Copy this:', text);
  }
}

// ---------- Menu ----------

function getMenuName() {
  const name = $('nameInput').value.trim();
  if (!name) {
    $('menuError').textContent = 'Please enter your name first.';
    $('nameInput').focus();
    return null;
  }
  $('menuError').textContent = '';
  storageSet(localStorage, 'power-deal-name', name);
  return cleanName(name);
}

function showTab(join) {
  $('showCreateButton').classList.toggle('active', !join);
  $('showJoinButton').classList.toggle('active', join);
  $('createPanel').hidden = join;
  $('joinPanel').hidden = !join;
  $('menuError').textContent = '';
}

function onCreate() {
  const name = getMenuName();
  if (!name) return;
  createRoom(name, Number($('maxPlayersInput').value));
}

function onJoin() {
  const name = getMenuName();
  if (!name) return;
  const code = normalizeCode($('codeInput').value);
  if (code.length !== CODE_LENGTH) {
    $('menuError').textContent = `Join codes are ${CODE_LENGTH} characters long.`;
    $('codeInput').focus();
    return;
  }
  joinRoom(name, code);
}

function init() {
  if (typeof Peer === 'undefined') {
    showStatus('Could not load the multiplayer library. Check your connection and refresh the page.');
    return;
  }

  $('nameInput').value = storageGet(localStorage, 'power-deal-name') || '';
  fillMaxPlayersSelect($('maxPlayersInput'), MIN_PLAYERS, DEFAULT_MAX_PLAYERS);

  // Invite links look like ?room=CODE
  const linkCode = normalizeCode(new URLSearchParams(location.search).get('room') || '');
  if (linkCode) {
    $('codeInput').value = linkCode;
    showTab(true);
  }

  $('showCreateButton').addEventListener('click', () => showTab(false));
  $('showJoinButton').addEventListener('click', () => showTab(true));
  $('createButton').addEventListener('click', onCreate);
  $('joinButton').addEventListener('click', onJoin);
  $('codeInput').addEventListener('input', e => { e.target.value = normalizeCode(e.target.value); });
  $('codeInput').addEventListener('keydown', e => { if (e.key === 'Enter') onJoin(); });
  $('nameInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') ($('joinPanel').hidden ? onCreate : onJoin)();
  });

  $('generateButton').addEventListener('click', () => send({ type: 'draw' }));
  $('discardButton').addEventListener('click', () => {
    if (confirm('Discard all your powerups?')) send({ type: 'discard' });
  });
  $('roomMaxPlayers').addEventListener('change', e => send({ type: 'setMax', max: Number(e.target.value) }));
  $('copyCodeButton').addEventListener('click', e => copyText(state.code, e.target));
  $('copyLinkButton').addEventListener('click', e => copyText(inviteLink(state.code), e.target));
  $('leaveButton').addEventListener('click', leaveRoom);
  $('statusButton').addEventListener('click', hideStatus);

  $('rulesText').addEventListener('click', toggleRulesPopup);
  $('rulesTextRoom').addEventListener('click', toggleRulesPopup);
  $('closeRulesButton').addEventListener('click', closeRulesPopup);

  // The room lives in the host's tab, so warn before closing it
  window.addEventListener('beforeunload', e => {
    if (isHost && state && state.players.length > 1) e.preventDefault();
  });
}

init();
