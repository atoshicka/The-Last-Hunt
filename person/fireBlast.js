export class FireBlast {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;
        this.damage = 40;
        this.timer = 0;
        this.duration = 20;
        this.radius = 40;
    }

    update(enemies) {
        this.timer++;

        enemies.forEach(e => {
            if (e.isDead) return;
            const dist = Math.hypot(this.x - e.x, this.y - e.y);
            if (dist < this.radius) {
                e.hp -= 1;
                if (e.hp <= 0) e.isDead = true;
            }
        });

        if (this.timer >= this.duration) this.dead = true;
    }

    draw(ctx) {
        if (this.dead) return;

        const alpha = 1 - this.timer / this.duration;

        for (let layer = 0; layer < 3; layer++) {
            const layerRadius = this.radius * (1 - layer * 0.25);
            const colors = [
                `rgba(255, 40, 0, ${alpha * 0.4})`,
                `rgba(255, 120, 0, ${alpha * 0.6})`,
                `rgba(255, 220, 0, ${alpha * 0.9})`,
            ];

            ctx.beginPath();
            const points = 12;
            for (let i = 0; i < points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const noise = layerRadius * 0.25 * Math.sin(i * 3.7 + this.timer * 0.5);
                const r = layerRadius + noise;
                const x = this.x + Math.cos(angle) * r;
                const  y = this.y + Math.sin(angle) * r;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = colors[layer];
            ctx.fill();
        }

        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + this.timer * 0.2;
            const dist = this.radius * 0.8 + this.timer * 1.5;
            const sx = this.x + Math.cos(angle) * dist;
            const sy = this.y + Math.sin(angle) * dist;
            const sparkSize = 3 * alpha;

            ctx.beginPath();
            ctx.arc(sx, sy, sparkSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 0, ${alpha})`;
            ctx.fill();
        }
    }
}