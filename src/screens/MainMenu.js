const mainMenu = document.getElementById('main-menu');

export function showMainMenu() {
  mainMenu.classList.remove('hidden');
  document.getElementById('level-select').classList.add('hidden');
  document.getElementById('game-screen').classList.add('hidden');
}

export function initMainMenu({ onPlay, onLevels }) {
  document.getElementById('btn-play').addEventListener('click', onPlay);
  document.getElementById('btn-levels').addEventListener('click', onLevels);
}