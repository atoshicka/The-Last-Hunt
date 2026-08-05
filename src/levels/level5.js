export const level5 = {
  spawnQueue: [
    [ { count: 1, type: 'ghost' } ],
    [ { count: 2, type: 'ghost' } ],
    [ { count: 2, type: 'zombie' } ],
    [ { count: 3, type: 'ghost' }, { count: 1, type: 'imp' } ],
    [ { count: 1, type: 'dog' } ],
    [ { count: 4, type: 'zombie' }, { count: 6, type: 'imp' } ],
    [ { count: 5, type: 'ghost' } ],
    [ { count: 2, type: 'death' } ],
    [ { count: 20, type: 'imp' }, { count: 7, type: 'ghost' } ],
    [ { count: 10, type: 'zombie' } ],
    [ { count: 3, type: 'dog' } ],
    [ { count: 4, type: 'death' } ],
    [ { count: 20, type: 'imp' } ],
    [ { count: 12, type: 'zombie' } ],
    [ { count: 9, type: 'ghost' }, { count: 11, type: 'zombie' }, { count: 3, type: 'death' }, { count: 6, type: 'imp' } ],
  ],

  availableCards: ['comissar', 'angel', 'salt', 'lans', 'ciul', 'kain', 'mad'],
  startMoney: 50,
  waveDelay: 20 * 60,
  spawnInterval: 14 * 60,
};