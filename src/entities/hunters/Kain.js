import { Hunter, createSprite } from './Hunter.js';

export class Kain extends Hunter {
  constructor(x, y) {
    super(x, y, { hp: 300, offset: { x: 48, y: 48 } });

    this.hasAttacked = false;
    this.maxAttackTime = 50;

    this.idleSprite = createSprite('src/assets/hunters/kain-idle.png');
    this.attackSprite = createSprite('src/assets/hunters/kain-attack.png');
  }

  get canSleep() {
    return this.state !== 'attack';
  }

  getSprite() {
    return this.state === 'attack' ? this.attackSprite : this.idleSprite;
  }

  onUpdate(enemies) {
    if (this.state === 'attack') {
      this.attackTimer++;
      this.attackSprite.update();

      if (this.attackTimer >= this.maxAttackTime) this.die();
      return null;
    }

    const threat = enemies.find(e =>
      e.row === this.row && !e.isDead && Math.abs(e.x - this.x) < 96
    );

    if (threat && !this.hasAttacked) {
      this.state = 'attack';
      this.hasAttacked = true;
      this.attackTimer = 0;

      return { bladeWave: true, x: this.x, y: this.y, target: threat };
    }

    this.state = 'idle';
    this.idleSprite.update();
    return null;
  }
}