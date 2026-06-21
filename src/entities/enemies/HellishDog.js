import { Sprite } from '../Sprite.js';

export class HellishDog {
    constructor(x, y, gridX) {
        this.x = x;
        this.y = y;
        this.gridX = gridX;
        this.scale = 2;
        this.speed = 0.5;
        this.hp = 200;
        this.maxHp = 220;
        this.isDead = false;
        this.damage = 20;
        this.attackTimer = 0;
        this.attackSpeed = 80;
        this.target = null;
        this.reachedEnd = false;
        this.isEnraged = false;

        this.normalSprite = new Sprite({
            src: 'assets/enemies/hellish-dog.png',
            frameWidth: 64,
            frameHeight: 64,
            frames: 2,
            speed: 20,
        });

        this.enragedSprite = new Sprite({
            src: 'assets/enemies/hellish-dog-enraged.png',
            frameWidth: 64,
            frameHeight: 64,
            frames: 2,
            speed: 10,
        });

        this.sprite = this.normalSprite;
    }

    update(hunters = []) {
        if (this.isDead) return;

        if (!this.isEnraged && this.hp < this.maxHp * 0.4) {
            this.isEnraged = true;
            this.speed = 1.0;
            this.damage = 60;
            this.attackSpeed = 50;
            this.sprite = this.enragedSprite;
        }

        if (this.x > this.gridX + 30) {
            const target = hunters.find(h =>
                h.row === this.row && Math.abs(h.x - this.x) < 96
            );

            if (target) {
                this.target = target;
                this.attackTimer++;
                if (this.attackTimer >= this.attackSpeed) {
                    this.attackTimer = 0;
                    target.hp -= this.damage;
                    if (target.hp <= 0) target.isDead = true;
                }
            } else {
                this.target = null;
                this.x -= this.speed;
            }
        } else {
            this.isDead = true;
            this.reachedEnd = true;
        }

        this.sprite.update();
    }

    draw(ctx) {
        if (this.isDead) return;
        const drawSize = 64 * this.scale;
        this.sprite.draw(ctx, this.x - drawSize / 2, this.y - drawSize / 2, this.scale);
    }
}