import { getSavedProgress } from '../core/progress.js';

const mainMenu = document.getElementById('main-menu');

export function showMainMenu(levels) {
  mainMenu.classList.remove('hidden');
  document.getElementById('level-select').classList.add('hidden');
  document.getElementById('game-screen').classList.add('hidden');
  renderMainMenu(levels);
}

function renderMainMenu(levels) {
  const progress = getSavedProgress();
  const completed = progress.completedLevels || [];
  const allDone = completed.length >= levels.length;

  const btnPlay = document.getElementById('btn-play');

  if (allDone) {
    btnPlay.textContent = 'Начать сначала';
    btnPlay.dataset.action = 'reset';
  } else {
    const nextLevel = completed.length;
    btnPlay.textContent = `Уровень ${nextLevel + 1}`;
    btnPlay.dataset.action = 'play';
  }
}

export function initMainMenu({ onPlay, onLevels, onReset }) {
  document.getElementById('btn-levels').addEventListener('click', onLevels);

  document.getElementById('btn-play').addEventListener('click', () => {
    const btn = document.getElementById('btn-play');

    if (btn.dataset.action === 'reset') {
      showResetConfirm(onReset);
    } else {
      const progress = getSavedProgress();
      const nextLevel = progress.completedLevels?.length || 0;
      onPlay(nextLevel);
    }
  });
}

function showResetConfirm(onConfirm) {
  const existing = document.getElementById('reset-confirm');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'reset-confirm';
  modal.innerHTML = `
    <div class="reset-modal">
      <p class="reset-text">Вы уверены, что хотите стереть текущий процесс?</p>
      <div class="reset-buttons">
        <button id="btn-reset-confirm" class="menu-btn primary">Да</button>
        <button id="btn-reset-cancel" class="menu-btn secondary">Отмена</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('btn-reset-confirm').addEventListener('click', () => {
    modal.remove();
    onConfirm();
  });

  document.getElementById('btn-reset-cancel').addEventListener('click', () => {
    modal.remove();
  });
}