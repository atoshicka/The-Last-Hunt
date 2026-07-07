import { canvas, COLS, ROWS, CELL_SIZE, GRID_X, GRID_Y, getCellCenter, getCanvasCoords } from '../core/canvas.js';
import { state } from '../core/state.js';
import { Comissar } from '../entities/hunters/Comissar.js';
import { Angel } from '../entities/hunters/Angel.js';
import { Lans } from '../entities/hunters/Lans.js';
import { Salt } from '../entities/Salt.js';
import { Ciul } from '../entities/hunters/Ciul.js';
import { Kain } from '../entities/hunters/Kain.js';

function createDragSprite(type, mx, my) {
  if (type === 'comissar') return new Comissar(mx, my);
  if (type === 'angel') return new Angel(mx, my);
  if (type === 'lans') return new Lans(mx, my);
  if (type === 'salt') return new Salt(mx, my);
  if (type === 'ciul') return new Ciul(mx, my);
  if (type === 'kain') return new Kain(mx, my);
  return null;
}

function placeHunter(type, pos, col, row) {
  let h;
  if (type === 'comissar') h = new Comissar(pos.x, pos.y);
  else if (type === 'angel') h = new Angel(pos.x, pos.y);
  else if (type === 'lans') h = new Lans(pos.x, pos.y);
  else if (type === 'salt') h = new Salt(pos.x, pos.y);
  else if (type === 'ciul') h = new Ciul(pos.x, pos.y);
  else if (type === 'kain') h = new Kain(pos.x, pos.y);
  if (!h) return;

  h.col = col;
  h.row = row;
  state.hunters.push(h);

  const card = state.cards.find(c => c.type === type);
  if (card) {
    card.timer = card.cooldown * 60;
    state.playerMoney -= card.cost;
  }
}

function removeHunterAt(clientX, clientY) {
  const { x: mx, y: my } = getCanvasCoords(clientX, clientY);

  const targetIndex = state.hunters.findIndex(h => {
    return Math.abs(h.x - mx) < 48 && Math.abs(h. y - my) < 48;
  });

  if (targetIndex !== -1) {
    state.hunters[targetIndex].isDead = true;
    state.hunters.splice(targetIndex, 1);
  }
}

export function initDragDrop() {
  let dragging = null;
  let dragSprite = null;
  let activePointerId = null;
  canvas.style.touchAction = 'none';

  function resetDrag() {
    if (activePointerId !== null && canvas.hasPointerCapture?.(activePointerId)) {
      canvas.releasePointerCapture(activePointerId);
    }
    dragging = null;
    dragSprite = null;
    state.dragSprite = null;
    activePointerId = null;
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (activePointerId !== null) return;
    if (e.pointerType === 'touch') e.preventDefault();

    const { x: mx, y: my } = getCanvasCoords(e.clientX, e.clientY);

    if (state.gameState === 'cardDrop') {
      const clickedCard = [state.droppedLansCard, state.droppedCiulCard, state.droppedKainCard].find(c =>
        c && mx >= c.x && mx <= c.x + c.width && my >= c.y && my <= c.y + c.height
      );

      if (clickedCard) {
        state.droppedLansCard = null;
        state.droppedCiulCard = null;
        state.droppedKainCard = null;
        state.gameState = 'win';
        canvas.dispatchEvent(new CustomEvent('gameWin'));
      }
      return;
    }

    if (state.gameState !== 'playing') return;

    for (let i = state.currencies.length - 1; i >= 0; i--) {
      const c = state.currencies[i];
      const dist = Math.hypot(mx - c.x, my - c.y);
      if (dist < 24) {
        state.playerMoney += c.value;
        state.currencies.splice(i, 1);
      }
    }

    state.cards.forEach(card => {
      if (mx >= card.x && mx <= card.x + card.width &&
          my >= card.y && my <= card.y + card.height) {
        if (card.timer > 0) return;
        if (state.playerMoney < card.cost) return;
        dragging = card.type;
        dragSprite = createDragSprite(card.type, mx, my);
        state.dragSprite = dragSprite;
        activePointerId = e.pointerId;
        canvas.setPointerCapture(e.pointerId);
      }
    });
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!dragSprite || e.pointerId !== activePointerId) return;
    if (e.pointerType === 'touch') e.preventDefault();

    const { x: dragX, y: dragY } = getCanvasCoords(e.clientX, e.clientY);
    dragSprite.x = dragX;
    dragSprite.y = dragY;
  });

  canvas.addEventListener('pointerup', (e) => {
    if (!dragging || e.pointerId !== activePointerId) return;

    const { x: mx, y: my } = getCanvasCoords(e.clientX, e.clientY);

    const col = Math.floor((mx - GRID_X) / CELL_SIZE);
    const row = Math.floor((my - GRID_Y) / CELL_SIZE);

    if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
      const pos = getCellCenter(col, row);
      const cellTaken = state.hunters.some(h => h.col === col && h.row === row);
      if (!cellTaken) placeHunter(dragging, pos, col, row);
    }

    resetDrag();
  });

  canvas.addEventListener('pointercancel', (e) => {
    if (e.pointerId !== activePointerId) return;
    resetDrag();
  });

  canvas.addEventListener('lostpointercapture', (e) => {
    if (e.pointerId !== activePointerId) return;
    resetDrag();
  });

  initShovelDragDrop();
}

function initShovelDragDrop() {
  const shovelImg = document.getElementById('shovel');
  if (!shovelImg) return;

  shovelImg.setAttribute('draggable', 'false');
  shovelImg.style.webkitUserDrag = 'none';
  shovelImg.style.userSelect = 'none';
  shovelImg.style.webkitUserSelect = 'none';
  shovelImg.addEventListener('dragstart', (e) => e.preventDefault());

  shovelImg.style.touchAction = 'none';

  let shovelPointerId = null;
  let shovelClone = null;

  function startShovelClone(clientX, clientY) {
    shovelClone = shovelImg.cloneNode(true);
    shovelClone.removeAttribute('id');
    shovelClone.setAttribute('draggable', 'false');
    shovelClone.style.position = 'fixed';
    shovelClone.style.pointerEvents = 'none';
    shovelClone.style.opacity = '0.7';
    shovelClone.style.zIndex = '60';
    shovelClone.style.width = `${shovelImg.offsetWidth}px`;
    shovelClone.style.height = `${shovelImg.offsetHeight}px`;
    shovelClone.style.left = `${clientX - shovelImg.offsetWidth / 2}px`;
    shovelClone.style.top = `${clientY - shovelImg.offsetHeight / 2}px`;
    document.body.appendChild(shovelClone);
  }

  function moveShovelClone(clientX, clientY) {
    if (!shovelClone) return;
    shovelClone.style.left = `${clientX - shovelClone.offsetWidth / 2}px`;
    shovelClone.style.top = `${clientY - shovelClone.offsetHeight / 2}px`;
  }

  function resetShovelDrag() {
    if (shovelPointerId !== null && shovelImg.hasPointerCapture?.(shovelPointerId)) {
      shovelImg.releasePointerCapture(shovelPointerId);
    }
    if (shovelClone) {
      shovelClone.remove();
      shovelClone = null;
    }
    shovelPointerId = null;
  }

  shovelImg.addEventListener('pointerdown', (e) => {
    if (shovelPointerId !== null) return;
    if (state.gameState !== 'playing') return;
    e.preventDefault();

    shovelPointerId = e.pointerId;
    shovelImg.setPointerCapture(e.pointerId);
    startShovelClone(e.clientX, e.clientY);
  });

  shovelImg.addEventListener('pointermove', (e) => {
    if (e.pointerId !== shovelPointerId) return;
    e.preventDefault();
    moveShovelClone(e.clientX, e.clientY);
  });

  shovelImg.addEventListener('pointerup', (e) => {
    if (e.pointerId !== shovelPointerId) return;
    removeHunterAt(e.clientX, e.clientY);
    resetShovelDrag();
  });

  shovelImg.addEventListener('pointercancel', (e) => {
    if (e.pointerId !== shovelPointerId) return;
    resetShovelDrag();
  });

  shovelImg.addEventListener('lostpointercapture', (e) => {
    if (e.pointerId !== shovelPointerId) return;
    resetShovelDrag();
  });
}