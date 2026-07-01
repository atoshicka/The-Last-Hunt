import { allCards, cardSprites } from './config.js';

const MAX_SQUAD = 5;
const HUNTER_TYPES = Object.keys(allCards);

const squadScreen = document.getElementById('squad-select');
const squadCardsContainer = document.getElementById('squad-cards');
const btnStart = document.getElementById('btn-squad-start');
const btnLevels = document.getElementById('btn-squad-levels');

let selected = [];
let onStartCallback = null;
let onLevelsCallback = null;
let renderLoopId = null;
let spriteCanvases = [];

export function initSquadSelect({ onStart, onLevels }) {
  onStartCallback = onStart;
  onLevelsCallback = onLevels;

  btnStart.addEventListener('click', () => {
    if (selected.length !== MAX_SQUAD) return;
    const chosen = [...selected];
    hideSquadSelect();
    if (onStartCallback) onStartCallback(chosen);
  });

  btnLevels.addEventListener('click', () => {
    hideSquadSelect();
    if (onLevelsCallback) onLevelsCallback();
  });
}

export function showSquadSelect() {
  selected = [];

  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('level-select').classList.add('hidden');
  document.getElementById('game-screen').classList.add('hidden');
  squadScreen.classList.remove('hidden');

  renderCards();
  updateStartButton();
  startRenderLoop();
}

function hideSquadSelect() {
  squadScreen.classList.add('hidden');
  stopRenderLoop();
}

function renderCards() {
  squadCardsContainer.innerHTML = '';
  spriteCanvases = [];

  HUNTER_TYPES.forEach(type => {
    const base = allCards[type];

    const card = document.createElement('div');
    card.className = 'squad-card';
    card.dataset.type = type;

    const spriteWrap = document.createElement('div');
    spriteWrap.className = 'squad-card-sprite';

    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = 96;
    spriteCanvas.height = 96;
    spriteWrap.appendChild(spriteCanvas);

    const label = document.createElement('div');
    label.className = 'squad-card-label';
    label.textContent = base.label;

    card.appendChild(spriteWrap);
    card.appendChild(label);

    card.addEventListener('click', () => toggleSelect(type));

    squadCardsContainer.appendChild(card);

    spriteCanvases.push({
      ctx: spriteCanvas.getContext('2d'),
      sprite: cardSprites[type],
    });
  });

  updateCardStates();
}

function toggleSelect(type) {
  const idx = selected.indexOf(type);

  if (idx !== -1) {
    selected.splice(idx, 1);
  } else {
    if (selected.length >= MAX_SQUAD) return;
    selected.push(type);
  }

  updateCardStates();
  updateStartButton();
}

function updateCardStates() {
  const full = selected.length >= MAX_SQUAD;

  squadCardsContainer.querySelectorAll('.squad-card').forEach(card => {
    const type = card.dataset.type;
    const isSelected = selected.includes(type);
    card.classList.toggle('selected', isSelected);
    card.classList.toggle('disabled', full && !isSelected);
  });
}

function updateStartButton() {
  btnStart.disabled = selected.length !== MAX_SQUAD;
}

function startRenderLoop() {
  stopRenderLoop();

  function loop() {
    spriteCanvases.forEach(({ ctx, sprite }) => {
      if (!sprite) return;
      ctx.clearRect(0, 0, 96, 96);
      sprite.draw(ctx, 0, 0, 1);
    });
    renderLoopId = requestAnimationFrame(loop);
  }

  loop();
}

function stopRenderLoop() {
  if (renderLoopId) {
    cancelAnimationFrame(renderLoopId);
    renderLoopId = null;
  }
}