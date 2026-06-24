import { Sprite } from "../Sprite.js";

export class Imp {
    constructor(x, y, gridX) {
        this.x = x;
        this.y = y;
        this.gridX = gridX;
        this.scale = 1.5;
        this.speed = 1.2;
        this.hp = 100;
        this.isDead = false;
        this.damage = 10;
        this.attackTimer = 0;
        this.attackSpeed = 60;
        this.target = null;
        this.reachedEnd = false;
        this.row = null;

        this.sprite = new Sprite({
            src: 'assets/enemies/imp.png',
            frameWidth: 64,
            frameHeight: 64,
            frames: 2,
            speed: 20,
        });
    }

  update(hunters = []) {
    if (this.isDead) return;

    if (this.x > this.gridX + 30) {
      const target = hunters.find(h =>
        h.row === this.row && Math.abs(h.x - this.x) < 96
      );

      if (target) {
        this.target = target;
        this.attackTimer++;
        if (this.attackTimer >= this.attackSpeed) {
          this.attackTimer = 0;
          target.hp -= this.damage;
          if (target.hp <= 0) target.isDead = true;
        }
      } else {
        this.target = null;
        this.x -= this.speed;
      }
    } else {
      this.isDead = true;
      this.reachedEnd = true;
    }

    this.sprite.update();
  }

  draw(ctx) {
    if (this.isDead) return;
    const drawSize = 64 * this.scale;
    this.sprite.draw(ctx, this.x - drawSize / 2, this.y - drawSize / 2, this.scale);
  }
}