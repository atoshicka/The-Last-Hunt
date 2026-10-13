import { state } from './core/state.js';
import { level1 } from './levels/level1.js';
import { level2 } from './levels/level2.js';
import { level3 } from './levels/level3.js';
import { level4 } from './levels/level4.js';
import { level5 } from './levels/level5.js';
import { level6 } from './levels/level6.js';
import { level7 } from './levels/level7.js';
import { initMainMenu, showMainMenu } from './screens/MainMenu.js';
import { initLevelSelect, showLevelSelect } from './screens/LevelSelect.js';
import { initOverlay, showOverlay } from './screens/Overlay.js';
import { initGame, showGame, loadLevel, update, draw } from './screens/Game.js';
import { initSquadSelect, showSquadSelect } from './screens/SquadSelect.js';
import { initTutorial } from './screens/Tutorial.js';
import { initDragDrop } from './input/dragDrop.js';
import { initCodex, initCodexControls } from './screens/Codex.js';
import { canvas, ctx, scaleCanvas } from './core/canvas.js';

const levels = [level1, level2, level3, level4, level5, level6, level7];
const SQUAD_SELECT_MIN_LEVEL_INDEX = 3;
let pendingLevelIndex = 0;

function getUnlockedHunters() {
  const baseHunters = ['comissar', 'angel', 'salt'];

  const progress = JSON.parse(localStorage.getItem('game_progress')) || { completedLevels: [] };

  let unlocked = [...baseHunters];

  if (progress.completedLevels.includes(0)) unlocked.push('lans');
  if (progress.completedLevels.includes(1)) unlocked.push('ciul');
  if (progress.completedLevels.includes(2)) unlocked.push('kain');
  if (progress.completedLevels.includes(3)) unlocked.push('mad');
  if (progress.completedLevels.includes(4)) unlocked.push('dair');

  return [...new Set(unlocked)];
}

initMainMenu({
  onPlay: (index) => requestStartLevel(index),
  onLevels: () => showLevelSelect(levels),
  onReset: () => {
    localStorage.removeItem('game_progress');
    showMainMenu(levels);
  }
});

initTutorial();

initLevelSelect({
  onBack: () => showMainMenu(levels),
  onSelect: (index) => requestStartLevel(index),
  onContinue: () => {
    document.getElementById('level-select').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
  },
});

initOverlay({
  onNext: () => {
    document.getElementById('overlay').classList.add('hidden');
    if (state.gameState === 'win' && state.currentLevel < levels.length - 1) {
      requestStartLevel(state.currentLevel + 1);
    } else if (state.gameState === 'gameover') {
      requestStartLevel(state.currentLevel);
    } else {
      requestStartLevel(0);
    }
  },
  onLevels: () => showLevelSelect(levels),
});

initGame(levels, () => showLevelSelect(levels));
initDragDrop();
initCodex(canvas, ctx);
initCodexControls();

initSquadSelect({
  onStart: (selectedSquad) => startLevel(pendingLevelIndex, selectedSquad),
  onLevels: () => showLevelSelect(levels),
});

document.getElementById('gameCanvas').addEventListener('gameWin', () => {
  state.gameState = 'win';

  const progress = JSON.parse(localStorage.getItem('game_progress')) || { completedLevels: [] };
  if (!progress.completedLevels.includes(state.currentLevel)) {
    progress.completedLevels.push(state.currentLevel);
    localStorage.setItem('game_progress', JSON.stringify(progress));
  }

  showOverlay('win', state.currentLevel, levels.length);
});

function requestStartLevel(index) {
  const isBonus = !!levels[index]?.isBonus;

  if (index >= SQUAD_SELECT_MIN_LEVEL_INDEX && !isBonus) {
    pendingLevelIndex = index;
    const unlocked = getUnlockedHunters();
    showSquadSelect(unlocked);
    return;
  }
  startLevel(index);
}

function startLevel(index, selectedSquad) {
  loadLevel(index, levels, selectedSquad);
  showGame();
  if (!state.gameLoopStarted) {
    state.gameLoopStarted = true;
    gameLoop();
  }
}

function gameLoop() {
  update(levels);
  draw();
  requestAnimationFrame(gameLoop);
}

showMainMenu(levels);
scaleCanvas();