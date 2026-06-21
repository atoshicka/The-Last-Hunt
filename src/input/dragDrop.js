import { canvas, COLS, ROWS, CELL_SIZE, GRID_X, GRID_Y, getCellCenter } from '../core/canvas.js';
import { state } from '../core/state.js';
import { Comissar } from '../entities/hunters/Comissar.js';
import { Angel } from '../entities/hunters/Angel.js';
import { Lans } from '../entities/hunters/Lans.js';
import { Salt } from '../entities/Salt.js';

function createDragSprite(type, mx, my) {
  if (type === 'comissar') return new Comissar(mx, my);
  if (type === 'angel') return new Angel(mx, my);
  if (type === 'lans') return new Lans(mx, my);
  if (type === 'salt') return new Salt(mx, my);
  return null;
}

function placeHunter(type, pos, col, row) {
  let h;
  if (type === 'comissar') h = new Comissar(pos.x, pos.y);
  else if (type === 'angel') h = new Angel(pos.x, pos.y);
  else if (type === 'lans') h = new Lans(pos.x, pos.y);
  else if (type === 'salt') h = new Salt(pos.x, pos.y);
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

export function initDragDrop() {
  let dragging = null;
  let dragSprite = null;

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (state.gameState === 'cardDrop' && state.droppedLansCard) {
      const c = state.droppedLansCard;
      if (mx >= c.x && mx <= c.x + c.width && my >= c.y && my <= c.y + c.height) {
        state.droppedLansCard = null;
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
      }
    });
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const dragX = e.clientX - rect.left;
    const dragY = e.clientY - rect.top;
    if (dragSprite) {
      dragSprite.x = dragX;
      dragSprite.y = dragY;
    }
  });

  canvas.addEventListener('mouseup', (e) => {
    if (!dragging) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const col = Math.floor((mx - GRID_X) / CELL_SIZE);
    const row = Math.floor((my - GRID_Y) / CELL_SIZE);

    if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
      const pos = getCellCenter(col, row);
      const cellTaken = state.hunters.some(h => h.col === col && h.row === row);
      if (!cellTaken) placeHunter(dragging, pos, col, row);
    }

    dragging = null;
    dragSprite = null;
    state.dragSprite = null;
  });
}