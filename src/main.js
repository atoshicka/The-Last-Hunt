import { state } from './core/state.js';
import { level1 } from './levels/level1.js';
import { level2 } from './levels/level2.js';
import { level3 } from './levels/level3.js';
import { level4 } from './levels/level4.js';
import { initMainMenu, showMainMenu } from './screens/MainMenu.js';
import { initLevelSelect, showLevelSelect } from './screens/LevelSelect.js';
import { initOverlay, showOverlay } from './screens/Overlay.js';
import { initGame, showGame, loadLevel, update, draw } from './screens/Game.js';
import { initSquadSelect, showSquadSelect } from './screens/SquadSelect.js';
import { initDragDrop } from './input/dragDrop.js';
import { initCodex, initCodexControls } from './screens/Codex.js';
import { canvas, ctx, scaleCanvas } from './core/canvas.js';

const levels = [level1, level2, level3, level4];

const SQUAD_SELECT_MIN_LEVEL_INDEX = 3;

let pendingLevelIndex = 0;

initMainMenu({
  onPlay: (index) => requestStartLevel(index),
  onLevels: () => showLevelSelect(levels),
  onReset: () => {
    localStorage.removeItem('game_progress');
    showMainMenu(levels);
  }
});

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
  showOverlay('win', state.currentLevel, levels.length);
});

function requestStartLevel(index) {
  if (index >= SQUAD_SELECT_MIN_LEVEL_INDEX) {
    pendingLevelIndex = index;
    showSquadSelect();
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