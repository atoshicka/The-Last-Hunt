import { state } from './core/state.js';
import { level1 } from './levels/level1.js';
import { level2 } from './levels/level2.js';
import { level3 } from './levels/level3.js';
import { level4 } from './levels/level4.js';
import { initMainMenu, showMainMenu } from './screens/MainMenu.js';
import { initLevelSelect, showLevelSelect } from './screens/LevelSelect.js';
import { initOverlay, showOverlay } from './screens/Overlay.js';
import { initGame, showGame, loadLevel, update, draw } from './screens/Game.js';
import { initDragDrop } from './input/dragDrop.js';
import { initCodex, initCodexControls } from './screens/Codex.js';
import { canvas, ctx, scaleCanvas } from './core/canvas.js';

const levels = [level1, level2, level3, level4];

initMainMenu({
  onPlay: (index) => startLevel(index),
  onLevels: () => showLevelSelect(levels),
  onReset: () => {
    localStorage.removeItem('game_progress');
    showMainMenu(levels);
  }
});

initLevelSelect({
  onBack: () => showMainMenu(levels),
  onSelect: (index) => startLevel(index),
  onContinue: () => {
    document.getElementById('level-select').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
  },
});

initOverlay({
  onNext: () => {
    document.getElementById('overlay').classList.add('hidden');
    if (state.gameState === 'win' && state.currentLevel < levels.length - 1) {
      startLevel(state.currentLevel + 1);
    } else if (state.gameState === 'gameover') {
      startLevel(state.currentLevel);
    } else {
      startLevel(0);
    }
  },
  onLevels: () => showLevelSelect(levels),
});

initGame(levels, () => showLevelSelect(levels));
initDragDrop();
initCodex(canvas, ctx);
initCodexControls();

document.getElementById('gameCanvas').addEventListener('gameWin', () => {
  state.gameState = 'win';
  showOverlay('win', state.currentLevel, levels.length);
});

function startLevel(index) {
  loadLevel(index, levels);
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