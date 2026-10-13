export const state = {
  gameState: 'playing',
  currentLevel: 0,
  cards: [],
  hunters: [],
  enemies: [],
  currencies: [],
  bullets: [],
  blazingBullets: [],
  crossOfExile: [],
  piercingShot: [],
  bladeWave: [],
  darkProjectiles: [],
  wakeSpark: [],
  playerMoney: 50,
  spawnQueue: [],
  spawnTimer: 0,
  waveTimer: 0,
  currentWave: 0,
  waveDelay: 10 * 60,
  spawnInterval: 8 * 60,
  droppedLansCard: null,
  droppedCiulCard: null,
  droppedKainCard: null,
  droppedMadCard: null,
  droppedDairCard: null,
  droppedBonusCard: null,
  dragSprite: null,
  gameLoopStarted: false,
  waveEnemyQueue: null,
  waveEnemyTimer: 0,
};

export function resetState(level) {
  state.hunters = [];
  state.enemies = [];
  state.currencies = [];
  state.bullets = [];
  state.blazingBullets = [];
  state.crossOfExile = [];
  state.piercingShot = [];
  state.bladeWave = [];
  state.darkProjectiles = [];
  state.wakeSpark = [];
  state.droppedLansCard = null;
  state.droppedCiulCard = null;
  state.droppedKainCard = null;
  state.droppedMadCard = null;
  state.droppedDairCard = null;
  state.droppedBonusCard = null;
  state.dragSprite = null;
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