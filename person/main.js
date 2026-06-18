import { Comissar, Angel, Lans } from './hunters.js';
import { Ghost } from './enemies.js';
import { Sprite } from './sprite.js';
import { Currency } from './currency.js';
import { Bullet } from './bullet.js';
import { FireBlast } from './FireBlast.js';
import { Salt } from './salt.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const waveGhostImage = new Image();
waveGhostImage.src = './assets/enemies/ghost.png';

canvas.width = 1100;
canvas.height = 600;

const COLS = 10;
const ROWS = 5;
const CELL_SIZE = 96;
const GRID_X = 150;
const GRID_Y = 80;

function getCellCenter(col, row) {
  return {
    x: GRID_X + col * CELL_SIZE + CELL_SIZE / 2,
    y: GRID_Y + row * CELL_SIZE + CELL_SIZE / 2,
  };
}

const enemies = [];
const spawnQueue = [1, 1, 2, 1, 2, 3, 1, 2, 3, 4].map(count => ({ count }));
let spawnTimer = 0;
let waveTimer = 0;
const WAVE_DELAY = 10 * 60;
let currentWave = 0;
let waveSpawned = 0;
const SPAWN_INTERVAL = 8 * 60;

const hunters = [];
const currencies = [];
const bullets = [];
const fireBlasts = [];
let playerMoney = 50;

const cards = [
  { type: 'comissar', label: 'comissar', x: 20, y: 60,  width: 110, height: 90, cooldown: 6, timer: 0, cost: 100 },
  { type: 'angel', label: 'angel', x: 20, y: 170, width: 110, height: 90, cooldown: 5, timer: 0, cost: 50 },
  { type: 'lans', label: 'lans', x: 20, y: 280, width: 110, height: 90, cooldown: 10, timer: 0, cost: 0 },
  { type: 'salt', label: 'salt', x: 20, y: 390, width: 110, height: 90, cooldown: 10, timer: 0, cost: 50 },
];

const comissarCardSprite = new Sprite({
  src: './assets/hunters/comissar-idle.png',
  frameWidth: 96, frameHeight: 96, frames: 1, speed: 1,
});

const angelCardSprite = new Sprite({
  src: './assets/hunters/angel.png',
  frameWidth: 96, frameHeight: 96, frames: 1, speed: 1,
});

const lansCardSprite = new Sprite({
  src: './assets/hunters/lans-idle.png',
  frameWidth: 96, frameHeight: 96, frames: 1, speed: 1,
});

const saltCardSprite = new Sprite({
  src: './assets/others/full-salt.png',
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
    const dist = Math.hypot(mx - c.x, my - c.y);
    if (dist < 24) {
      playerMoney += c.value;
      currencies.splice(i, 1);
    }
  }

  cards.forEach(card => {
    if (mx >= card.x && mx <= card.x + card.width &&
        my >= card.y && my <= card.y + card.height) {

      if (card.timer > 0) return;
      if (playerMoney < card.cost) return;
          
      dragging = card.type;
      if (card.type === 'comissar') dragSprite = new Comissar(mx, my);
      if (card.type === 'angel') dragSprite = new Angel(mx, my);
      if (card.type === 'lans') dragSprite = new Lans(mx, my);
      if (card.type === 'salt') dragSprite = new Salt(mx, my);
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
      if (dragging === 'comissar') {
        const h = new Comissar(pos.x, pos.y);
        h.col = col; h.row = row;
        hunters.push(h);
        const card = cards.find(c => c.type === 'comissar');
        card.timer = card.cooldown * 60;
        playerMoney -= card.cost;
      } else if (dragging === 'angel') {
        const h = new Angel(pos.x, pos.y);
        h.col = col; h.row = row;
        hunters.push(h);
        const card = cards.find(c => c.type === 'angel');
        card.timer = card.cooldown * 60;
        playerMoney -= card.cost;
      } else if (dragging === 'lans') {
        const h = new Lans(pos.x, pos.y);
        h.col = col; h.row = row;
        hunters.push(h);
        const card = cards.find(c => c.type === 'lans');
        card.timer = card.cooldown * 60;
        playerMoney -= card.cost;
      } else if (dragging === 'salt') {
        const h = new Salt(pos.x, pos.y);
        h.col = col; h.row = row;
        hunters.push(h);
        const card = cards.find(c => c.type === 'salt');
        card.timer = card.cooldown * 60;
        playerMoney -= card.cost;
      }
    }
  }

  dragging = null;
  dragSprite = null;
});

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

    if (card.type === 'comissar') comissarCardSprite.draw(ctx, spriteX, spriteY, scale);
    if (card.type === 'angel') angelCardSprite.draw(ctx, spriteX, spriteY, scale);
    if (card.type === 'lans') lansCardSprite.draw(ctx, spriteX, spriteY, scale);
    if (card.type === 'salt') saltCardSprite.draw(ctx, spriteX, spriteY, scale);

    if (playerMoney < card.cost) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(card.x, card.y, card.width, card.height);
    }

    if (card.timer > 0) {
      const totalTicks = card.cooldown * 60;
      const progress = card.timer / totalTicks;
      const darkHeight = card.height * progress;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(card.x, card.y, card.width, darkHeight);

      ctx.fillStyle = '#fbf3f3';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        Math.ceil(card.timer / 60),
        card.x + card.width / 2,
        card.y + card.height / 2
      );
    }

    ctx.fillStyle = '#fbf3f3';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(card.label, card.x + card.width / 2, card.y + card.height - 10);

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${card.cost}`, card.x + card.width - 14, card.y + 14);
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
  ctx.fillText(`${playerMoney}`, canvas.width - 20, 42);
}

function update() {
  waveTimer++;

  if (waveTimer >= WAVE_DELAY && currentWave < spawnQueue.length) {
    spawnTimer++;

    if (spawnTimer >= SPAWN_INTERVAL) {
      spawnTimer = 0;
      const wave = spawnQueue[currentWave];

      for (let i = 0; i < wave.count; i++) {
        const row = Math.floor(Math.random() * ROWS);
        const pos = getCellCenter(9, row);
        const g = new Ghost(pos.x, pos.y, GRID_X);
        g.row = row;
        enemies.push(g);
      }

      currentWave++;
    }
  }

  hunters.forEach(h => {
    const result = h.update ? h.update(enemies) : null;

    if (result?.shoot) {
      bullets.push(new Bullet(result.x, result.y));
    }
    if (result?.flame) {
      fireBlasts.push(new FireBlast(result.x, result.y));
    }

    if (h.constructor.name === 'Angel') {
      h.dropTimer = (h.dropTimer || 0) + 1;
      if (h.dropTimer >= 60 * 15) {
        h.dropTimer = 0;
        currencies.push(new Currency(h.x + 30, h.y + 30));
      }
    }
  });

  cards.forEach(card => {
    if (card.timer > 0) card.timer--;
  });

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update(enemies);
    if (bullets[i].dead) bullets.splice(i, 1);
  }

  for (let i = fireBlasts.length - 1; i >= 0; i--) {
    fireBlasts[i].update(enemies);
    if (fireBlasts[i].dead) fireBlasts.splice(i, 1);
  }

  enemies.forEach(e => e.update(hunters));
  for (let i = hunters.length - 1; i >= 0; i--) {
    if (hunters[i].isDead) hunters.splice(i, 1);
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].isDead) enemies.splice(i, 1);
  }

  currencies.forEach(c => c.update());
}

function drawWaveProgress() {
  if (waveTimer < WAVE_DELAY) return;

  const barWidth = 160; 
  const barX = canvas.width - 130 - barWidth - 100;
  const barY = 32;
  const barHeight = 6; 

  const totalWaves = spawnQueue.length;
  const currentProgressTicks = (currentWave * SPAWN_INTERVAL) + (currentWave < totalWaves ? spawnTimer : 0);
  const totalProgressTicks = totalWaves * SPAWN_INTERVAL;

  const rawProgress = totalProgressTicks > 0 ? Math.min(currentProgressTicks / totalProgressTicks, 1) : 0;
  const progress = 1 - rawProgress; 

  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(barX, barY, barWidth * progress, barHeight);

  ctx.fillStyle = '#534ab7';
  ctx.fillRect(barX + barWidth * progress, barY, barWidth * (1 - progress), barHeight);

  ctx.strokeStyle = '#534ab7';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barWidth, barHeight);

  const ghostX = barX + barWidth * progress;
  const ghostY = barY + barHeight / 2;

  const sourceX = 0;
  const sourceY = 0;
  const sourceWidth = 32;
  const sourceHeight = 64;

  const displayScale = 0.35; 

  const iconWidth = sourceWidth * displayScale;
  const iconHeight = sourceHeight * displayScale;

  if (waveGhostImage.complete && waveGhostImage.naturalWidth !== 0) {
    ctx.drawImage(
      waveGhostImage,
      sourceX, sourceY,
      sourceWidth, sourceHeight,
      ghostX - iconWidth / 2,
      ghostY - iconHeight / 2,
      iconWidth, iconHeight
    );
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0d0d1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawCards();

  hunters.forEach(h => h.draw(ctx));
  enemies.forEach(e => e.draw(ctx));
  bullets.forEach(b => b.draw(ctx));
  fireBlasts.forEach(f => f.draw(ctx));
  currencies.forEach(c => c.draw(ctx));

  if (dragging && dragSprite) {
    ctx.globalAlpha = 0.7;
    dragSprite.draw(ctx);
    ctx.globalAlpha = 1;
  }

  drawWaveProgress();
  drawMoney();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();