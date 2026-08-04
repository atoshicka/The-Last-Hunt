export class BlazingBullet {
    constructor(x, y) {
        this.x = x;
        this.y = y + 6;
        this.speed = 6;
        this.damage = 30;
        this.dead = false;
        this.timer = 0;
    }

    update(enemies) {
        if (this.dead) return;
        
        this.x += this.speed;
        this.timer++;

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

        ctx.save();
        
        ctx.shadowColor = '#ff4500';
        ctx.shadowBlur = 15;

        const tailLength = 4;
        for (let i = tailLength; i > 0; i--) {
            const offsetX = this.x - (i * 5);
            const waveY = Math.sin(this.timer * 0.5 + i) * (i * 0.5); 
            const offsetY = this.y + waveY;

            const flicker = Math.random() * 0.5;
            const radius = Math.max(1, (6 - i) - flicker);

            ctx.beginPath();
            ctx.arc(offsetX, offsetY, radius, 0, Math.PI * 2);

            if (i === 4) ctx.fillStyle = 'rgba(200, 0, 0, 0.5)'; 
            else if (i === 3) ctx.fillStyle = 'rgba(255, 69, 0, 0.7)';
            else if (i === 2) ctx.fillStyle = 'rgba(255, 140, 0, 0.9)';
            else ctx.fillStyle = '#ffd700'; 

            ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff'; 
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffff00';
        ctx.fill();

        ctx.restore();
    }
}