import { Sprite } from "./sprite.js";

export class Ghost {
    constructor(x, y, gridX) {
        this.x = x;
        this.y = y;
        this.gridX = gridX;
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

        if (this.x > this.gridX) {
            this.x -= this.speed;
        } else {
            this.isDead = true;
        }

        this.sprite.update();
    }

    draw(ctx) {
        if (this.isDead) return;

        const drawSize = 32 * this.scale;
        this.sprite.draw(ctx, this.x - drawSize / 2, this.y - drawSize / 2, this.scale);
    }
};
