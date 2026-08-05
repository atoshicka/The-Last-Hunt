import { Sprite } from '../Sprite.js';

export class Mad {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.scale = 1;
    this.state = 'idle';
    this.attackTimer = 0;
    this.attackSpeed = 110;
    this.row = null;
    this.col = null;
    this.hp = 120;
    this.isDead = false;
    this.protection = 60; 
    this.isArmored = true;

    this.armoredIdleSprite = new Sprite({
      src: 'src/assets/hunters/mad-full-idle.png',
      frameWidth: 96, frameHeight: 96, frames: 1, speed: 1,
    });

    this.armoredAttackSprite = new Sprite({
      src: 'src/assets/hunters/mad-full-attack.png',
      frameWidth: 96, frameHeight: 96, frames: 1, speed: 1,
    });

    this.bareIdleSprite = new Sprite({
      src: 'src/assets/hunters/mad-idle.png', 
      frameWidth: 96, frameHeight: 96, frames: 1, speed: 1,
    });

    this.bareAttackSprite = new Sprite({
      src: 'src/assets/hunters/mad-attack.png',
      frameWidth: 96, frameHeight: 96, frames: 1, speed: 1,
    });
  }

  takeDamage(amount) {
    if (this.isArmored && this.protection > 0) {
      this.protection -= amount;

      if (this.protection <= 0) {
        this.protection = 0;
        this.isArmored = false;
      }
    } else {
      this.hp -= amount;
      if (this.hp <= 0) this.isDead = true;
    }
  }

  update(enemies = []) {
    if (this.isDead) return null;

    const target = enemies.find(e => e.row === this.row && !e.isDead);

    if (target) {
      this.state = 'attack';
      this.attackTimer++;
      if (this.attackTimer >= this.attackSpeed) {
        this.attackTimer = 0;
        return { blazingShoot: true, x: this.x + 48, y: this.y };
      }
    } else {
      this.state = 'idle';
      this.attackTimer = 0;
    }

    if (this.isArmored) {
      this.armoredIdleSprite.update();
      this.armoredAttackSprite.update();
    } else {
      this.bareIdleSprite.update();
      this.bareAttackSprite.update();
    }

    return null;
  }

  draw(ctx) {
    if (this.isDead) return;

    const idleSprite = this.isArmored ? this.armoredIdleSprite : this.bareIdleSprite;
    const attackSprite = this.isArmored ? this.armoredAttackSprite : this.bareAttackSprite;
    const sprite = this.state === 'attack' ? attackSprite : idleSprite;

    sprite.draw(ctx, this.x - 48, this.y - 46, this.scale);

  }
}