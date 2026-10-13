export const level4 = {
  spawnQueue: [
    [ { count: 1, type: 'ghost' } ],
    [ { count: 2, type: 'ghost' } ],
    [ { count: 1, type: 'ghost' }, { count: 1, type: 'dog' } ],
    [ { count: 5, type: 'imp' } ],
    [ { count: 1, type: 'death' } ],
    [ { count: 2, type: 'dog' } ],
    [ { count: 4, type: 'ghost' }, { count: 12, type: 'imp' } ],
    [ { count: 1, type: 'death' } ],
    [ { count: 12, type: 'imp' } ],
    [ { count: 2, type: 'death' }, { count: 6, type: 'ghost' } ],
    [ { count: 3, type: 'dog' } ],
    [ { count: 3, type: 'death' }, { count: 3, type: 'ghost' } ],
    [ { count: 20, type: 'imp' } ],
  ],

  availableCards: ['comissar', 'angel', 'salt', 'lans', 'ciul', 'kain'],
  startMoney: 50,
  waveDelay: 18 * 60,
  spawnInterval: 14 * 60,
};