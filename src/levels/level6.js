export const level6 = {
    spawnQueue: [
        [ { count: 1, type: 'zombie' } ],
        [ { count: 2, type: 'zombie' } ],
        [ { count: 1, type: 'gin' } ],
        [ { count: 3, type: 'imp' }, { count: 1, type: 'ghost' } ],
        [ { count: 1, type: 'dog' } ],
        [ { count: 2, type: 'gin' }, { count: 1, type: 'death' } ],
        [ { count: 3, type: 'zombie' }, { count: 2, type: 'gin' }, { count: 3, type: 'zombie' } ],
        [ { count: 2, type: 'gin' }, { count: 2, type: 'dog' }, { count: 2, type: 'gin' }, { count: 2, type: 'dog' } ],
        [ { count: 5, type: 'imp' }, { count: 3, type: 'ghost' }, { count: 2, type: 'zombie' } ],
        [ { count: 3, type: 'dog' }, { count: 2, type: 'gin' } ],
        [ { count: 2, type: 'death' }, { count: 1, type: 'gin' }, ],
    ],

    availableCards: ['comissar', 'angel', 'salt', 'lans', 'ciul', 'kain', 'mad', 'dair'],
    startMoney: 50,
    waveDelay: 16 * 60,
    spawnInterval: 12 * 60,
}