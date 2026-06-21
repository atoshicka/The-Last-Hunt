import { Sprite } from './Sprite.js';

export class Currency {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.startY = y;
    this.bobTimer = 0;
    this.value = 50;
    this.collected = false;

    this.sprite = new Sprite({
      src: 'assets/others/light.png',
      frameWidth: 32, frameHeight: 32, frames: 1, speed: 1,
    });
  }

  update() {
    if (this.collected) return;
    if (this.bobTimer < Math.PI) {
      this.bobTimer += 0.08;
      this.y = this.startY - Math.sin(this.bobTimer) * 20;
    }
  }

  draw(ctx) {
    if (this.collected) return;
    this.sprite.draw(ctx, this.x - 16, this.y - 16, 1);
  }
}