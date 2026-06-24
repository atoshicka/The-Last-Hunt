export class PiercingShot {
    constructor(x, y) {
        this.x = x;
        this.y = y + 6;
        this.speed = 8;
        this.damage = 15;
        this.dead = false;

        this.isSalt = Math.random() < 0.4;
        this.color = this.isSalt ? '#efefef' : '#434343';

        this.hitEnemies = new Set();
    }

    update(enemies) {
        if (this.dead) return;

        this.x += this.speed;

        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];

            if (e.isDead || this.hitEnemies.has(e)) continue;

            const dist = Math.hypot(this.x - e.x, this.y - e.y);
            if (dist < 30) {
                e.hp -= this.damage;
                if (e.hp <= 0) e.isDead = true;

                this.hitEnemies.add(e);

                if (this.isSalt) {
                    if (!e.isSlowed && !e.isDead) {
                        e.isSlowed = true;
                        const originalSpeed = e.speed;
                        e.speed = originalSpeed * 0.5; 

                        setTimeout(() => {
                            if (e && !e.isDead) {
                                e.speed = originalSpeed;
                                e.isSlowed = false;
                            }
                        }, 3000);
                    }
                    this.dead = true;
                    break; 
                }
            }
        }

        if (this.x > 1200) {
            this.dead = true;
            this.hitEnemies.clear();
        }
    }

    draw(ctx) {
        if (this.dead) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}