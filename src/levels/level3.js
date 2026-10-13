export const level3 = {
  spawnQueue: [
    [ { count: 1, type: 'ghost' } ],
    [ { count: 2, type: 'ghost' } ],
    [ { count: 3, type: 'imp' } ],
    [ { count: 1, type: 'dog' } ],
    [ { count: 3, type: 'imp' }, { count: 4, type: 'ghost' } ],
    [ { count: 6, type: 'imp' } ],
    [ { count: 4, type: 'ghost' } ],
    [ { count: 3, type: 'dog' } ],
    [ { count: 6, type: 'imp' }, { count: 8, type: 'ghost' } ],
    [ { count: 8, type: 'imp' } ],
    [ { count: 4, type: 'ghost' } ],
    [ { count: 6, type: 'dog' } ],
  ],

  availableCards: ['comissar', 'angel', 'salt', 'lans', 'ciul'],
  startMoney: 50,
  waveDelay: 18 * 60,
  spawnInterval: 13 * 60,
};