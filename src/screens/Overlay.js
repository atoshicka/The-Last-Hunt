import { saveProgress } from '../core/progress.js';

const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayBtn = document.getElementById('overlay-btn');

export function showOverlay(gameState, currentLevel, levelsCount) {
  if (gameState === 'gameover') {
    overlayTitle.style.color = '#ff4444';
    overlayTitle.textContent = 'Поражение...';
    overlayBtn.textContent = 'Начать заново';
  } else if (gameState === 'win') {
    saveProgress(currentLevel);
    const isLastLevel = currentLevel >= levelsCount - 1;
    overlayTitle.style.color = '#ffd700';
    overlayTitle.textContent = isLastLevel ? 'Игра пройдена!' : 'Уровень пройден!';
    overlayBtn.textContent = isLastLevel ? 'Начать сначала' : 'Следующий уровень';
  }
  overlay.classList.remove('hidden');
}

export function hideOverlay() {
  overlay.classList.add('hidden');
}

export function initOverlay({ onNext, onLevels }) {
  overlayBtn.addEventListener('click', onNext);
  document.getElementById('overlay-levels-btn').addEventListener('click', onLevels);
}