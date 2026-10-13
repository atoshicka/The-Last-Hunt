export const level7 = {
  isBonus: true,

  spawnQueue: [
    [ { count: 20, type: 'ghost' } ],
    [ { count: 10, type: 'gin' }, { count: 10, type: 'dog' } ],
    [ { count: 10, type: 'death' }, { count: 30, type: 'gin' }, { count: 30, type: 'ghost' } ],
  ],

  availableCards: ['comissar', 'dair'],
  startMoney: 0,
  waveDelay: 8 * 60,
  spawnInterval: 8 * 60,
};