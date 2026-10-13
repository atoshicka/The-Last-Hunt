export class WakeSpark {
    constructor(x, y, target) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.dead = false;
        this.timer = 0;
        this.maxTime = 20;
    }

    update() {
        if (this.dead) return;
        this.timer++;
        if (this.timer >= this.maxTime) this.dead = true;
    }

    draw(ctx) {
        if (this.dead) return;

        const alpha = 1 - this.timer / this.maxTime;
        const tx = this.target.x;
        const ty = this.target.y - 10;
        const segments = 8;

        ctx.save();
        ctx.strokeStyle = `rgba(255, 245, 130, ${alpha})`;
        ctx.shadowColor = '#ffe84a';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        for (let i = 1; i < segments; i++) {
            const t = i /segments;
            const jitter =(Math.random() - 0.5) * 22;
            ctx.lineTo(
                this.x + (tx - this.x) * t + jitter,
                this.y + (ty - this.y) * t + jitter
            );
        }

        ctx.lineTo(tx, ty);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(tx, ty, 14 * alpha + 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
        ctx.fill();

        ctx.restore();
    }
}