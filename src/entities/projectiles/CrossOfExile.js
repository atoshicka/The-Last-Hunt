export class CrossOfExile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;
        this.damage = 30;
        this.timer = 0;
        this.duration = 30;
        this.radius = 45;
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

        const progress = this.timer / this.duration; 
        const alpha = 1 - progress;

        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.beginPath();
        ctx.arc(0, 0, this.radius * (0.6 + progress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 210, 255, ${alpha * 0.2})`;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgba(150, 240, 255, ${alpha * 0.6})`;
        ctx.stroke();

        ctx.save();
        ctx.rotate(this.timer * 0.15);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.85, 0, Math.PI * 2);
        ctx.setLineDash([12, 6, 3, 6]);
        ctx.strokeStyle = `rgba(0, 191, 255, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = `rgba(220, 250, 255, ${alpha})`;
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 20; 

        const crossLength = this.radius * 1.1;
        const crossThickness = this.radius * 0.25;

        const scale = Math.min(1, progress * 5);
        ctx.scale(scale, scale);

        ctx.fillRect(-crossThickness / 2, -crossLength, crossThickness, crossLength * 2);
        ctx.fillRect(-crossLength, -crossThickness / 2, crossLength * 2, crossThickness);

        ctx.restore();

        for (let i = 0; i < 5; i++) {
            const offsetX = Math.cos(i * 1.5 + this.timer * 0.5) * this.radius * 0.7;
            const offsetY = -this.timer * 1.5 - (i * 4); 
            const sparkSize = 2.5 * alpha;

            ctx.beginPath();
            ctx.arc(this.x + offsetX, this.y + offsetY, sparkSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 245, 255, ${alpha})`;
            ctx.fill();
        }
    }
}