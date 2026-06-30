import { Sprite } from '../Sprite.js';
import { DarkProjectile } from '../projectiles/DarkProjectile.js';

export class Death {
  constructor(x, y, gridX) {
    this.x = x;
    this.y = y;
    this.gridX = gridX;
    this.scale = 1; 
    this.speed = 0.5;
    this.hp = 666;
    this.isDead = false;
    this.damage = 80;
    this.attackTimer = 0;
    this.attackSpeed = 90;
    this.target = null;
    this.reachedEnd = false;
    this.row = null;

    this.idleSprite = new Sprite({
      src: 'src/assets/enemies/death-idle.png',
      frameWidth: 92, frameHeight: 92, frames: 2, speed: 30,
    });

    this.attackSprite = new Sprite({
      src: 'src/assets/enemies/death-attack.png',
      frameWidth: 92, frameHeight: 92, frames: 1, speed: 15,
    });

    this.sprite = this.idleSprite;
  }

  update(hunters = [], projectiles = []) {
    if (this.isDead) return;

    if (this.hp <= 0) {
      this.isDead = true;
      return;
    }

    if (this.x <= this.gridX + 30) {
      this.isDead = true;
      this.reachedEnd = true;
      return;
    }

    if (this.target && this.target.isDead) {
      this.target = null;
      this.sprite = this.idleSprite;
    }

    if (!this.target) {
      const closeHunter = hunters.find(h =>
        h.row === this.row && Math.abs(h.x - this.x) < 96
      );
      const farKain = hunters.find(h =>
        h.row === this.row &&
        h.constructor.name === 'Kain' &&
        Math.abs(h.x - this.x) < 192 &&
        Math.abs(h.x - this.x) >= 96
      );

      if (closeHunter) {
        this.target = closeHunter;
        this.sprite = this.attackSprite;
        this.attackTimer = 0;
      } else if (farKain) {
        this.target = farKain;
        this.sprite = this.attackSprite;
        this.attackTimer = 0;
      } else {
        this.x -= this.speed;
      }
    } else {
      this.attackTimer++;
      if (this.attackTimer >= this.attackSpeed) {
        this.attackTimer = 0;

        projectiles.push(new DarkProjectile(this.target.x, this.target.y, this.target, this.damage));
      }
    }

    this.sprite.update();
  }

  draw(ctx) {
    if (this.isDead) return;
    const drawSize = 92 * this.scale;
    this.sprite.draw(ctx, this.x - drawSize / 2, this.y - drawSize / 2, this.scale);
  }
}