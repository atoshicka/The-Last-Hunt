import { Sprite } from "./sprite.js";

export class Ghost {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.scale = 3;
        this.speed = 1;
        this.hp = 50;
        this.isDead = false;

        this.sprite = new Sprite({
            src: './assets/enemies/ghost.png',
            frameWidth: 32,
            frameHeight: 32,
            frames: 2,
            speed: 12,
        });
    }

    update() {
        if (this.isDead) return;

        this.x -= this.speed;

        this.sprite.update();
    }

    draw(ctx) {
        if (this.isDead) return;

        this.sprite.draw(ctx, this.x, this.y, this.scale);
    }
}