import { Sprite } from "./Sprite.js";

export class Salt {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hp = 200;
        this.maxHp = 200;
        this.isDead = false;
        this.col = null;
        this.row = null;
        this.scale = 1;

        this.state = 'full';

        this.sprite = new Sprite({
            src: './assets/others/full-salt.png',
            frameWidth: 64,
            frameHeight: 64,
            frames: 1,
            speed: 1,
        });
    }

    draw(ctx) {
        if (this.isDead) return;

        this.sprite.draw(ctx, this.x - 32, this.y - 20, this.scale);
    }

    update() {
        if (this.hp <= 0) {
            this.isDead = true;
            return;
        }

        if (this.hp <= 60 && this.state === 'damage') {
            this.state = 'onTheEdge';

            this.sprite = new Sprite({
                src: './assets/others/almost-eaten-salt.png', 
                frameWidth: 64,
                frameHeight: 64,
                frames: 1,
                speed: 1,
            });
        } 
        else if (this.hp <= this.maxHp / 2 && this.state === 'full') {
            this.state = 'damage';

            this.sprite = new Sprite({
                src: './assets/others/slightly-eaten-salt.png',
                frameWidth: 64,
                frameHeight: 64,
                frames: 1,
                speed: 1,
            });
        }
    }
}