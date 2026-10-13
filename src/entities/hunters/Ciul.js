import { Shooter } from './Shooter.js';

export class Ciul extends Shooter {
  constructor(x, y) {
    super(x, y, {
      hp: 120,
      attackSpeed: 120,
      idleSrc: 'src/assets/hunters/ciul-idle.png',
      attackSrc: 'src/assets/hunters/ciul-attack.png',
      offset: { x: 50, y: 45 },
    });
  }

  createAction() {
    return { piercingShot: true, x: this.x + 48, y: this.y };
  }
}