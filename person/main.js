import { Commissioner, Angel } from './hunters.js';
import { Ghost } from './enemies.js';
import { Sprite } from './sprite.js';
import { Currency } from './currency.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1100;
canvas.height = 600;

const COLS = 10;
const ROWS = 5;
const CELL_SIZE = 96;
const GRID_X = 150;
const GRID_Y = 80;

const hunters = [];
const currencies = [];
let playerMoney = 0;

const cards = [
  { type: 'commissioner', label: 'commissioner', x: 20, y: 60,  width: 110, height: 90 },
  { type: 'angel',        label: 'angel',        x: 20, y: 170, width: 110, height: 90 },
];

const commissionerCardSprite = new Sprite({
  src: './assets/hunters/commissioner-idle.png',
  frameWidth: 96, frameHeight: 96, frames: 1, speed: 1,
});

const angelCardSprite = new Sprite({
  src: './assets/hunters/angel.png',
  frameWidth: 96, frameHeight: 96, frames: 1, speed: 1,
});

let dragging = null;
let dragSprite = null;
let dragX = 0;
let dragY = 0;

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  for (let i = currencies.length - 1; i >= 0; i--) {
    const c = currencies[i];
    if (c.collected) continue;
    const dist = Math.hypot(mx - c.x, my - c.y);
    if (dist < 24) {
      c.collected = true;
      playerMoney += c.value;
      currencies.splice(i, 1);
    }
  }

  cards.forEach(card => {
    if (mx >= card.x && mx <= card.x + card.width &&
        my >= card.y && my <= card.y + card.height) {
      dragging = card.type;
      if (card.type === 'commissioner') dragSprite = new Commissioner(mx, my);
      if (card.type === 'angel') dragSprite = new Angel(mx, my);
    }
  });
});

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  dragX = e.clientX - rect.left;
  dragY = e.clientY - rect.top;
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
    const cellTaken = hunters.some(h => h.col === col && h.row === row);

    if (!cellTaken) {
      if (dragging === 'commissioner') {
        const h = new Commissioner(pos.x, pos.y);
        h.col = col; h.row = row;
        hunters.push(h);
      } else if (dragging === 'angel') {
        const h = new Angel(pos.x, pos.y);
        h.col = col; h.row = row;
        hunters.push(h);
      }
    }
  }

  dragging = null;
  dragSprite = null;
});

function getCellCenter(col, row) {
  return {
    x: GRID_X + col * CELL_SIZE + CELL_SIZE / 2,
    y: GRID_Y + row * CELL_SIZE + CELL_SIZE / 2,
  };
}

const ghost = new Ghost(getCellCenter(9, 1).x, getCellCenter(9, 1).y, GRID_X);

function drawGrid() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = GRID_X + col * CELL_SIZE;
      const y = GRID_Y + row * CELL_SIZE;
      ctx.fillStyle = row % 2 === col % 2 ? '#1a1a2e' : '#16162a';
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      ctx.strokeStyle = '#2a2a4a';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

function drawCards() {
  cards.forEach(card => {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(card.x, card.y, card.width, card.height);
    ctx.strokeStyle = '#534ab7';
    ctx.lineWidth = 2;
    ctx.strokeRect(card.x, card.y, card.width, card.height);

    const scale = 0.6;
    const drawSize = 96 * scale;
    const spriteX = card.x + card.width / 2 - drawSize / 2;
    const spriteY = card.y + 10;

    if (card.type === 'commissioner') commissionerCardSprite.draw(ctx, spriteX, spriteY, scale);
    if (card.type === 'angel') angelCardSprite.draw(ctx, spriteX, spriteY, scale);

    ctx.fillStyle = '#fbf3f3';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(card.label, card.x + card.width / 2, card.y + card.height - 10);
  });
}

function drawMoney() {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(canvas.width - 130, 10, 120, 50);
  ctx.strokeStyle = '#534ab7';
  ctx.lineWidth = 2;
  ctx.strokeRect(canvas.width - 130, 10, 120, 50);
  ctx.fillStyle = '#f7f0f0';
  ctx.font = '16px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`💰 ${playerMoney}`, canvas.width - 20, 42);
}

function update() {
  hunters.forEach(h => {
    h.update();

    if (h.constructor.name === 'Angel') {
      h.dropTimer = (h.dropTimer || 0) + 1;
      if (h.dropTimer >= 60 * 8) {
        h.dropTimer = 0;
        currencies.push(new Currency(h.x + 30, h.y + 30));
      }
    }
  });

  currencies.forEach(c => c.update());
  ghost.update();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0d0d1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawCards();

  hunters.forEach(h => h.draw(ctx));
  ghost.draw(ctx);
  currencies.forEach(c => c.draw(ctx));

  if (dragging && dragSprite) {
    ctx.globalAlpha = 0.7;
    dragSprite.draw(ctx);
    ctx.globalAlpha = 1;
  }

  drawMoney();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();