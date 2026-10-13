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

  _levels.forEach((level, index) => {
    const completed = isLevelCompleted(index);
    const unlocked = isLevelUnlocked(index);
    const isBonus = !!level.isBonus;

    const levelNum = isBonus && !completed
      ? '?'
      : String(index + 1).padStart(2, '0');

    let status = '';
    if (completed) status = 'ПРОЙДЕН';
    else if (isBonus) status = 'БОНУС';

    const card = document.createElement('div');
    card.className = [
      'level-card',
      unlocked ? '' : 'locked',
      completed ? 'completed' : '',
      isBonus ? 'bonus' : '',
    ].filter(Boolean).join(' ');

    if (unlocked) {
      card.innerHTML = `
        <div class="card-decor"></div>
        <div class="card-content">
          <div class="level-header">
            <span class="level-number">${levelNum}</span>
          </div>
          <div class="level-status">${status}</div>
        </div>
      `;
      card.addEventListener('click', () => {
        if (_onSelect) _onSelect(index);
      });
    } else {
      card.innerHTML = `
        <div class="card-decor"></div>
        <div class="card-content">
          <div class="level-header">
            <span class="level-number">${levelNum}</span>
          </div>
          <div class="lock-pattern"></div>
        </div>
      `;
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