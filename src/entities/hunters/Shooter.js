import { Hunter, createSprite } from './Hunter.js';

export class Shooter extends Hunter {
  constructor(x, y, { hp, attackSpeed, idleSrc, attackSrc, offset }) {
    super(x, y, { hp, offset });
    this.attackSpeed = attackSpeed;
    this.idleSprite = createSprite(idleSrc);
    this.attackSprite = createSprite(attackSrc);
  }

  createAction(target) { return null; }

  getSprite() {
    return this.state === 'attack' ? this.attackSprite : this.idleSprite;
  }

  updateSprites() {
    this.idleSprite.update();
    this.attackSprite.update();
  }

  onUpdate(enemies) {
    const target = enemies.find(e => e.row === this.row && !e.isDead);
    let action = null;

    if (target) {
      this.state = 'attack';
      this.attackTimer++;
      if (this.attackTimer >= this.attackSpeed) {
        this.attackTimer = 0;
        action = this.createAction(target);
      }
    } else {
      this.state = 'idle';
      this.attackTimer = 0;
    }

    this.updateSprites();
    return action;
  }
}