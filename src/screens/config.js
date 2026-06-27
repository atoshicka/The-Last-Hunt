import { Sprite } from '../entities/Sprite.js';

export const allCards = {
  comissar: { type: 'comissar', label: 'comissar', width: 110, height: 80, cooldown: 6,  cost: 100 },
  angel: { type: 'angel', label: 'angel', width: 110, height: 80, cooldown: 5,  cost: 50  },
  salt: { type: 'salt', label: 'salt', width: 110, height: 80, cooldown: 10, cost: 50  },
  lans: { type: 'lans', label: 'lans', width: 110, height: 80, cooldown: 10, cost: 200 },
  ciul: {type: 'ciul', label: 'ciul', width: 110, height: 80, cooldown: 8, cost: 100},
};

export const cardSprites = {
  comissar: new Sprite({ src: 'src/assets/hunters/comissar-idle.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
  angel: new Sprite({ src: 'src/assets/hunters/angel.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
  salt: new Sprite({ src: 'src/assets/others/full-salt.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
  lans: new Sprite({ src: 'src/assets/hunters/lans-idle.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
  ciul: new Sprite({ src: 'src/assets/hunters/ciul-idle.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
};