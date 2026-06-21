import { isLevelUnlocked, isLevelCompleted } from '../core/progress.js';
import { state } from '../core/state.js';

const levelSelect = document.getElementById('level-select');
const levelCardsContainer = document.getElementById('level-cards');

let _levels = [];
let _onSelect = null;

export function showLevelSelect(levels) {
  _levels = levels;
  document.getElementById('main-menu').classList.add('hidden');
  levelSelect.classList.remove('hidden');
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('overlay').classList.add('hidden');
  renderLevelCards();
}

function renderLevelCards() {
  levelCardsContainer.innerHTML = '';

  _levels.forEach((_, index) => {
    const completed = isLevelCompleted(index);
    const unlocked = isLevelUnlocked(index);

    const card = document.createElement('div');
    card.className = `level-card ${unlocked ? '' : 'locked'}`;

    card.innerHTML = `
      ${!unlocked ? '<span class="lock-icon">?</span>' : ''}
      <span class="level-number">${index + 1}</span>
      ${completed ? '<span class="level-status">✓ Пройден</span>' : ''}
    `;

    if (unlocked) {
      card.addEventListener('click', () => {
        if (_onSelect) _onSelect(index);
      });
    }

    levelCardsContainer.appendChild(card);
  });

  const continueBtn = document.getElementById('btn-continue');
  if (continueBtn) {
    if (state.gameLoopStarted) {
      continueBtn.classList.remove('hidden');
    } else {
      continueBtn.classList.add('hidden');
    }
  }
}

export function initLevelSelect({ onBack, onSelect, onContinue }) {
  _onSelect = onSelect;
  document.getElementById('btn-back-menu').addEventListener('click', onBack);
  const continueBtn = document.getElementById('btn-continue');
  if (continueBtn) {
    continueBtn.addEventListener('click', onContinue);
  }
}