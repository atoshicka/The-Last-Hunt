import { Hunter, createSprite } from './Hunter.js';

export class Angel extends Hunter {
  constructor(x, y) {
    super(x, y, { hp: 100, offset: { x: 40, y: 45 } });
    this.sprite = createSprite('src/assets/hunters/angel.png', { speed: 15 });
  }

  getSprite() {
    return this.sprite;
  }

  onUpdate() {
    this.sprite.update();
    return null;
  }
}