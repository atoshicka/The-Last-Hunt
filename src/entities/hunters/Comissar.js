import { Shooter } from './Shooter.js';

export class Comissar extends Shooter {
  constructor(x, y) {
    super(x, y, {
      hp: 130,
      attackSpeed: 120,
      idleSrc: 'src/assets/hunters/comissar-idle.png',
      attackSrc: 'src/assets/hunters/comissar-atack.png',
      offset: { x: 40, y: 50 },
    });
  }

  createAction() {
    return { shoot: true, x: this.x + 48, y: this.y };
  }
}