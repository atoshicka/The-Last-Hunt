import { Sprite } from '../Sprite.js';

export class Gin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.scale = 1;
    this.hp = 100;
    this.isDead = false;
    this.reachedEnd = false;
    this.row = null;
    this.speed = 0;

    this.phase = 'appear';
    this.timer = 0;
    this.appearTime = 25;
    this.lingerTime = 140;
    this.fadeTime = 20;

    this.idleSprite = new Sprite({
      src: 'src/assets/enemies/gin-idle.png',
      frameWidth: 96, frameHeight: 96, frames: 1, speed: 1,
    });
  }

  castSleep(hunters) {
    const victims = hunters.filter(h => !h.isDead && !h.isAsleep && h.canSleep);
    if (victims.length === 0) return;
    victims[Math.floor(Math.random() * victims.length)].putToSleep();
  }

  update(hunters = []) {
    if (this.isDead) return;

    this.timer++;

    switch (this.phase) {
      case 'appear':
        if (this.timer >= this.appearTime) {
          this.phase = 'linger';
          this.timer = 0;
          this.castSleep(hunters);
        }
        break;

      case 'linger':
        if (this.timer >= this.lingerTime) {
          this.phase = 'fade';
          this.timer = 0;
        }
        break;

      case 'fade':
        if (this.timer >= this.fadeTime) this.isDead = true;
        break;
    }
  }

  draw(ctx) {
    if (this.isDead) return;

    let alpha = 1;
    if (this.phase === 'appear') alpha = Math.min(1, this.timer / this.appearTime);
    if (this.phase === 'fade') alpha = 1 - this.timer / this.fadeTime;

    const drawSize = this.idleSprite.frameWidth * this.scale;

    ctx.save();
    ctx.globalAlpha = alpha;
    this.idleSprite.draw(ctx, this.x - drawSize / 2, this.y - drawSize / 2, this.scale);
    ctx.restore();
  }
}