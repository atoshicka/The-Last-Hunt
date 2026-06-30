import { Sprite } from '../Sprite.js';

export class Kain {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.scale = 1;
    this.state = 'idle';
    this.row = null;
    this.col = null;
    this.hp = 300;
    this.isDead = false;
    this.hasAttacked = false;
    this.attackTimer = 0;
    this.maxAttackTime = 50;

    this.idleSprite = new Sprite({
      src: 'src/assets/hunters/kain-idle.png',
      frameWidth: 96, frameHeight: 96, frames: 1, speed: 1,
    });

    this.attackSprite = new Sprite({
      src: 'src/assets/hunters/kain-attack.png',
      frameWidth: 96, frameHeight: 96, frames: 1, speed: 1,
    });
  }

  update(enemies = []) {
    if (this.isDead) return null;

    if (this.state === 'attack') {
      this.attackTimer++;
      this.attackSprite.update();

      if (this.attackTimer >= this.maxAttackTime) {
        this.isDead = true;
      }
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

  draw(ctx) {
    if (this.isDead) return;
    const sprite = this.state === 'attack' ? this.attackSprite : this.idleSprite;
    sprite.draw(ctx, this.x - 48, this.y - 48, this.scale);
  }
}