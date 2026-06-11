export class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y + 6;
        this.speed = 5;
        this.damage = 20;
        this.dead = false;
    }

    update(enemies) {
        this.x += this.speed;

        enemies.forEach(e => {
            if (e.isDead) return;
            const dist = Math.hypot(this.x - e.x, this.y - e.y);
            if (dist < 30) {
                e.hp -= this.damage;
                if (e.hp <= 0) e.isDead = true;
                this.dead = true;
            }
        });

        if (this.x > 1200) this.dead = true;
    }

    draw(ctx) {
        if (this.dead) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#969696';
        ctx.fill();
    }
}
