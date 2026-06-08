import { Sprite } from "./sprite.js";

export class Commissioner {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.scale = 1;

        this.idleSprite = new Sprite({
            src: './assets/hunters/commissioner-idle.png',
            frameWidth: 96,
            frameHeight: 96,
            frames: 1,
            speed: 1,
        });

        this.attackSprite = new Sprite({
            src: './assets/hunters/commissioner-atack.png',
            frameWidth: 96,
            frameHeight: 96,
            frames: 1,
            speed: 1,
        });
    }

    setState(state) {
        this.state = state;
    }

    update() {
        this.idleSprite.update();
        this.attackSprite.update();
    }

    draw(ctx) {
    const sprite = this.state === 'attack' ? this.attackSprite : this.idleSprite;
    sprite.draw(ctx, this.x - 40, this.y - 50, this.scale);
    }
};

export class Angel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.scale = 1;

        this.sprite = new Sprite({
            src: './assets/hunters/angel.png',
            frameWidth: 96,
            frameHeight: 96,
            frames: 1,
            speed: 15,
        });
    }

    update() {
        this.sprite.update();
    }

    draw(ctx) {
        this.sprite.draw(ctx, this.x - 40, this.y - 45, this.scale);
    }
};