import { canvas, ctx, COLS, ROWS, CELL_SIZE, GRID_X, GRID_Y, getCellCenter } from '../core/canvas.js';
import { state, resetState } from '../core/state.js';
import { allCards, cardSprites } from './config.js';
import { Ghost } from '../entities/enemies/Ghost.js';
import { HellishDog } from '../entities/enemies/HellishDog.js';
import { Imp } from '../entities/enemies/Imp.js';
import { Bullet } from '../entities/projectiles/Bullet.js';
import { CrossOfExile } from '../entities/projectiles/CrossOfExile.js';
import { PiercingShot } from '../entities/projectiles/PiercingShot.js';
import { Currency } from '../entities/Currency.js';
import { showOverlay } from './Overlay.js';

const waveGhostImage = new Image();
waveGhostImage.src = 'assets/enemies/ghost.png';

let levelsCount = 0;

export function showGame() {
  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('level-select').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
}

export function initGame(levels, onLevelsSelect) {
  levelsCount = levels.length;
  document.getElementById('btn-levels-ingame').addEventListener('click', () => {
    if (onLevelsSelect) {
      onLevelsSelect();
    } else {
      document.getElementById('game-screen').classList.add('hidden');
      document.getElementById('level-select').classList.remove('hidden');
    }
  });
}

export function loadLevel(levelIndex, levels) {
  state.currentLevel = levelIndex;
  resetState(levels[levelIndex]);

  let cardY = 60;
  state.cards = levels[levelIndex].availableCards.map(type => {
    const base = allCards[type];
    const card = { ...base, x: 20, y: cardY, timer: 0 };
    cardY += 110;
    return card;
  });
}

export function update(levels) {
  if (state.gameState !== 'playing') return;

  state.waveTimer++;

  if (state.waveTimer >= state.waveDelay && state.currentWave < state.spawnQueue.length) {
    state.spawnTimer++;

    if (state.spawnTimer >= state.spawnInterval) {

      if (!state.waveEnemyQueue) {
        const wave = state.spawnQueue[state.currentWave];
        state.waveEnemyQueue = [];
        for (let i = 0; i < wave.count; i++) {
          state.waveEnemyQueue.push({
            type: wave.type,
            delay: i * 90,
            spawned: false,
          });
        }
        state.waveEnemyTimer = 0;
      }

      state.waveEnemyTimer++;

      state.waveEnemyQueue.forEach(entry => {
        if (!entry.spawned && state.waveEnemyTimer >= entry.delay) {
          entry.spawned = true;
          const row = Math.floor(Math.random() * ROWS);
          const pos = getCellCenter(9, row);

          let enemy;
          if (entry.type === 'dog') enemy = new HellishDog(pos.x, pos.y, GRID_X);
          else if (entry.type === 'imp') enemy = new Imp(pos.x, pos.y, GRID_X);
          else enemy = new Ghost(pos.x, pos.y, GRID_X);

          enemy.row = row;
          state.enemies.push(enemy);
        }
      });

      if (state.waveEnemyQueue.every(e => e.spawned)) {
        state.waveEnemyQueue = null;
        state.waveEnemyTimer = 0;
        state.spawnTimer = 0;
        state.currentWave++;
      }
    }
  }

  state.hunters.forEach(h => {
    const result = h.update ? h.update(state.enemies) : null;
    if (result?.shoot) state.bullets.push(new Bullet(result.x, result.y));
    if (result?.flame) state.crossOfExile.push(new CrossOfExile(result.x, result.y));
    if (result?.piercingShot) state.piercingShot.push(new PiercingShot(result.x, result.y));

    if (h.constructor.name === 'Angel') {
      h.dropTimer = (h.dropTimer || 0) + 1;
      if (h.dropTimer >= 60 * 13) {
        h.dropTimer = 0;
        state.currencies.push(new Currency(h.x + 30, h.y + 30));
      }
    }
  });

  state.cards.forEach(card => { if (card.timer > 0) card.timer--; });

  for (let i = state.bullets.length - 1; i >= 0; i--) {
    state.bullets[i].update(state.enemies);
    if (state.bullets[i].dead) state.bullets.splice(i, 1);
  }

  for (let i = state.crossOfExile.length - 1; i >= 0; i--) {
    state.crossOfExile[i].update(state.enemies);
    if (state.crossOfExile[i].dead) state.crossOfExile.splice(i, 1);
  }

  for (let i = state.piercingShot.length - 1; i >= 0; i--) {
    state.piercingShot[i].update(state.enemies);
    if (state.piercingShot[i].dead) state.piercingShot.splice(i, 1);
  }

  state.enemies.forEach(e => {
    e.update(state.hunters);
    if (e.reachedEnd) {
      state.gameState = 'gameover';
      showOverlay('gameover', state.currentLevel, levels.length);
    }
  });

  for (let i = state.hunters.length - 1; i >= 0; i--) {
    if (state.hunters[i].isDead) state.hunters.splice(i, 1);
  }
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    if (state.enemies[i].isDead) state.enemies.splice(i, 1);
  }

  if (state.currentWave >= state.spawnQueue.length && state.enemies.length === 0 && !state.waveEnemyQueue) {
    if (state.currentLevel === 0 && !state.droppedLansCard) {
      state.gameState = 'cardDrop';
      state.droppedLansCard = {
        x: Math.random() * (canvas.width - 300) + 200,
        y: Math.random() * (canvas.height - 250) + 100,
        width: 110,
        height: 130,
        bobTimer: 0,
      };
    } else if (state.currentLevel === 1 && !state.droppedCiulCard) {
      state.gameState = 'cardDrop';
      state.droppedCiulCard = {
        x: Math.random() * (canvas.width - 300) + 200,
        y: Math.random() * (canvas.height - 250) + 100,
        width: 110,
        height: 130,
        bobTimer: 0,
      };
    } else if (state.currentLevel >= 2) {
      state.gameState = 'win';
      showOverlay('win', state.currentLevel, levels.length);
    }
  }

  state.currencies.forEach(c => c.update());
}

export function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0d0d1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  state.hunters.forEach(h => h.draw(ctx));
  state.enemies.forEach(e => e.draw(ctx));

  state.bullets.forEach(b => b.draw(ctx));
  state.crossOfExile.forEach(f => f.draw(ctx));
  state.piercingShot.forEach(p => p.draw(ctx));

  drawCards();

  state.currencies.forEach(c => c.draw(ctx));

  drawDroppedCards();
  drawWaveProgress();
  drawMoney();

  if (state.dragSprite) {
    ctx.globalAlpha = 0.7;
    state.dragSprite.draw(ctx);
    ctx.globalAlpha = 1;
  }
}

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
  state.cards.forEach(card => {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(card.x, card.y, card.width, card.height);
    ctx.strokeStyle = '#534ab7';
    ctx.lineWidth = 2;
    ctx.strokeRect(card.x, card.y, card.width, card.height);

    const scale = 0.6;
    const drawSize = 96 * scale;
    const spriteX = card.x + card.width / 2 - drawSize / 2;
    const spriteY = card.y + 10;
    cardSprites[card.type]?.draw(ctx, spriteX, spriteY, scale);

    if (state.playerMoney < card.cost) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(card.x, card.y, card.width, card.height);
    }

    if (card.timer > 0) {
      const progress = card.timer / (card.cooldown * 60);
      const darkHeight = card.height * progress;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(card.x, card.y, card.width, darkHeight);
      ctx.fillStyle = '#fbf3f3';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(Math.ceil(card.timer / 60), card.x + card.width / 2, card.y + card.height / 2);
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
  ctx.fillText(`${state.playerMoney}`, canvas.width - 20, 42);
}

function drawWaveProgress() {
  if (state.waveTimer < state.waveDelay) return;

  const barWidth = 160;
  const barX = canvas.width - 130 - barWidth - 100;
  const barY = 32;
  const barHeight = 6;

  const totalWaves = state.spawnQueue.length;
  const currentProgressTicks = state.currentWave * state.spawnInterval + (state.currentWave < totalWaves ? state.spawnTimer : 0);
  const totalProgressTicks = totalWaves * state.spawnInterval;
  const rawProgress = Math.min(currentProgressTicks / totalProgressTicks, 1);
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

  if (waveGhostImage.complete && waveGhostImage.naturalWidth !== 0) {
    ctx.drawImage(waveGhostImage, 0, 0, 32, 32, ghostX - 6, ghostY - 6, 12, 12);
  }
}

function drawDroppedCards() {
  const drawCard = (c, spriteKey, label) => {
    if (!c) return;
    if (c.bobTimer < Math.PI) c.bobTimer = (c.bobTimer || 0) + 0.08;
    const bobY = c.y - Math.sin(c.bobTimer) * 20;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(c.x, bobY, c.width, c.height);
    ctx.strokeStyle = '#534ab7';
    ctx.lineWidth = 2;
    ctx.strokeRect(c.x, bobY, c.width, c.height);

    const scale = 0.6;
    const spriteX = c.x + c.width / 2 - (96 * scale) / 2;
    cardSprites[spriteKey]?.draw(ctx, spriteX, bobY + 10, scale);

    ctx.fillStyle = '#fbf3f3';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, c.x + c.width / 2, bobY + c.height - 10);
  };

  drawCard(state.droppedLansCard, 'lans', 'lans');
  drawCard(state.droppedCiulCard, 'ciul', 'ciul');
}