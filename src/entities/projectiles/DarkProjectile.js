export class DarkProjectile {
  constructor(x, y, target, damage) {
    this.x = x - 5; 
    this.y = y;
    this.target = target;
    this.damage = damage;
    this.dead = false;
    this.timer = 0;
    this.maxDuration = 40;
    this.currentRadius = 0;
    this.maxRadius = 45;

    if (this.target && !this.target.isDead) {
      this.target.hp -= this.damage;
      if (this.target.hp <= 0) this.target.isDead = true;
    }
  }

  update() {
    if (this.dead) return;

    this.timer++;

    if (this.timer <= this.maxDuration * 0.4) {
      this.currentRadius = (this.timer / (this.maxDuration * 0.4)) * this.maxRadius;
    } else {
      const progress = (this.timer - this.maxDuration * 0.4) / (this.maxDuration * 0.6);
      this.currentRadius = this.maxRadius * (1 - progress);
    }

    if (this.timer >= this.maxDuration) {
      this.dead = true;
    }
  }

  draw(ctx) {
    if (this.dead) return;

    ctx.save();

    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0, 
      this.x, this.y, this.currentRadius
    );
    
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(0.5, 'rgba(74, 0, 114, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
  }
}