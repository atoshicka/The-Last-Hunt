import { Sprite } from '../Sprite.js';

export class Comissar {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.scale = 1;
        this.state = 'idle';
        this.attackTimer = 0;
        this.attackSpeed = 120;
        this.row = null;
        this.hp = 130; 
        this.isDead = false;

        this.idleSprite = new Sprite({
            src: 'assets/hunters/comissar-idle.png',
            frameWidth: 96, frameHeight: 96, frames: 1, speed: 1,
        });

        this.attackSprite = new Sprite({
            src: 'assets/hunters/comissar-atack.png',
            frameWidth: 96, frameHeight: 96, frames: 1, speed: 1,
        });
    }

    setState(state) { this.state = state; }

    update(enemies = []) {
        const target = enemies.find(e => e.row === this.row && !e.isDead);

        if (target) {
            this.state = 'attack';
            this.attackTimer++;
            if (this.attackTimer >= this.attackSpeed) {
                this.attackTimer = 0;
                return { shoot: true, x: this.x + 48, y: this.y };
            }
        } else {
            this.state = 'idle';
            this.attackTimer = 0;
        }

        this.idleSprite.update();
        this.attackSprite.update();
        return null;
    }

    draw(ctx) {
        const sprite = this.state === 'attack' ? this.attackSprite : this.idleSprite;
        sprite.draw(ctx, this.x - 40, this.y - 50, this.scale);
    }
}