export class BladeWave {
  constructor(x, y, target) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.dead = false;
    this.timer = 0;
    this.maxTime = 50;
    this.hasKilled = false;
  }

  update() {
    if (this.dead) return;
    this.timer++;

    if (this.timer >= this.maxTime) {
      this.dead = true;
      if (this.target) {
        this.target.hp = 0;
        this.target.isDead = true;
      }
    }
  }

  draw(ctx) {
    if (this.dead) return;

    const progress = this.timer / this.maxTime;
    const sparkX = this.target ? this.x + (this.target.x - this.x) * 0.5 : this.x + 40;
    const sparkY = this.target ? (this.y + this.target.y) / 2 : this.y;

    ctx.save();
    ctx.shadowColor = '#fafafa';

    if (progress < 0.3) {
      const p = progress / 0.3;
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, p * 25, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p * 0.4})`;
      ctx.fill();

      ctx.strokeStyle = '#fafafa';
      ctx.lineWidth = 5 * p;
      ctx.shadowBlur = 25;

      ctx.beginPath();

      ctx.moveTo(sparkX - 45 * p, sparkY - 25 * p);
      ctx.lineTo(sparkX + 45 * p, sparkY + 25 * p);
      ctx.stroke();

    } else {
      const p = (progress - 0.3) / 0.7;
      const alpha = 1 - p;

      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 14 * alpha;
      ctx.shadowBlur = 40 * alpha;

      ctx.beginPath();
      ctx.moveTo(sparkX - 45, sparkY - 25);
      ctx.lineTo(sparkX + 45, sparkY + 25);
      ctx.stroke();

      const rayCount = 8;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + Math.sin(i) * 0.2;
        const length = 15 + p * 85;
        
        ctx.lineWidth = (i % 2 === 0 ? 3 : 1) * alpha;
        ctx.shadowBlur = 15 * alpha;
        
        ctx.beginPath();
        ctx.moveTo(sparkX, sparkY);
        ctx.lineTo(sparkX + Math.cos(angle) * length, sparkY + Math.sin(angle) * length);
        ctx.stroke();
      }

      const particleCount = 12;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + p * 0.5;
        const speedModifier = 0.5 + (i % 3) * 0.5;
        const dist = (10 + p * 100) * speedModifier;
        
        const px = sparkX + Math.cos(angle) * dist;
        const py = sparkY + Math.sin(angle) * dist;

        ctx.beginPath();
        ctx.arc(px, py, (i % 2 === 0 ? 2 : 4) * alpha, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowBlur = 12 * alpha;
        ctx.fill();
      }
    }

    ctx.restore();
  }
}