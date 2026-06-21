import { Sprite } from '../Sprite.js';

export class Angel {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.scale = 1;
    this.row = null;
    this.col = null;
    this.hp = 100;
    this.isDead = false;

    this.sprite = new Sprite({
      src: 'assets/hunters/angel.png',
      frameWidth: 96, frameHeight: 96, frames: 1, speed: 15,
    });
  }

  update() {
    this.sprite.update();
    return null;
  }

  draw(ctx) {
    this.sprite.draw(ctx, this.x - 40, this.y - 45, this.scale);
  }
}