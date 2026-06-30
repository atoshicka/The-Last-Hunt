export const state = {
  gameState: 'playing',
  currentLevel: 0,
  cards: [],
  hunters: [],
  enemies: [],
  currencies: [],
  bullets: [],
  crossOfExile: [],
  piercingShot: [],
  bladeWave: [],
  darkProjectiles: [],
  playerMoney: 50,
  spawnQueue: [],
  spawnTimer: 0,
  waveTimer: 0,
  currentWave: 0,
  waveDelay: 10 * 60,
  spawnInterval: 8 * 60,
  droppedLansCard: null,
  gameLoopStarted: false,
  waveEnemyQueue: null,
  waveEnemyTimer: 0,
};

export function resetState(level) {
  state.hunters = [];
  state.enemies = [];
  state.currencies = [];
  state.bullets = [];
  state.crossOfExile = [];
  state.piercingShot = [];
  state.bladeWave = [];
  state.darkProjectiles = [];
  state.droppedLansCard = null;
  state.playerMoney = level.startMoney;
  state.spawnQueue = level.spawnQueue;
  state.spawnTimer = 0;
  state.waveTimer = 0;
  state.currentWave = 0;
  state.waveDelay = level.waveDelay;
  state.spawnInterval = level.spawnInterval;
  state.gameState = 'playing';
  state.waveEnemyQueue = null;
  state.waveEnemyTimer = 0;
}