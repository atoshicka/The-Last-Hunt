import { Sprite } from '../Sprite.js';

export function createSprite(src, { size = 96, speed = 1 } = {}) {
  return new Sprite({
    src,
    frameWidth: size,
    frameHeight: size,
    frames: 1,
    speed,
  });
}

export class Hunter {
  constructor(x, y, { hp, offset = { x: 48, y: 46 } }) {
    this.x = x;
    this.y = y;
    this.scale = 1;
    this.row = null;
    this.col = null;

    this.hp = hp;
    this.maxHp = hp;
    this.hpGhost = hp;
    this.hpShown = hp;
    this.healHold = 0;
    this.isDead = false;

    this.sinceDamage = 9999;

    this.state = 'idle';
    this.attackTimer = 0;
    this.drawOffset = offset;

    this.isAsleep = false;
    this.sleepMax = 100;
    this.sleepMeter = 0;
    this.selfWakeAmount = 5;
    this.sleepTickInterval = 60;
    this.sleepTimer = 0;

    this.shield = 0;
    this.maxShield = 0;
    this.shieldGhost = 0;
  }

  get canSleep() { return true; }

  setState(state) { this.state = state; }

  takeDamage(amount) {
    this.sinceDamage = 0;
    const left = this.absorbShield(amount);
    if (left > 0) this.applyDamage(left);
  }

  applyDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
    }
  }

  heal(amount) {
    if (this.isDead) return;
    this.hp = Math.min(this.maxHp, this.hp + amount);
    this.healHold = 60;
  }

  die() {
    this.isDead = true;
    this.isAsleep = false;
    this.shield = 0;
  }

  applyShield(amount) {
    this.shield = amount;
    this.maxShield = amount;
    this.shieldGhost = amount;
  }

  regenShield(amount) {
    if (this.maxShield <= 0) return;
    this.shield = Math.min(this.maxShield, this.shield + amount);
  }

  absorbShield(amount) {
    if (this.shield <= 0) return amount;
    const absorbed = Math.min(this.shield, amount);
    this.shield -= absorbed;
    return amount - absorbed;
  }

  putToSleep() {
    if (this.isDead || this.isAsleep || !this.canSleep) return;
    this.isAsleep = true;
    this.sleepMeter = this.sleepMax;
    this.sleepTimer = 0;
    this.state = 'idle';
    this.attackTimer = 0;
  }

  reduceSleep(amount) {
    if (!this.isAsleep) return;
    this.sleepMeter -= amount;
    if (this.sleepMeter <= 0) this.wakeUp();
  }

  tickSleep() {
    this.sleepTimer++;
    if (this.sleepTimer >= this.sleepTickInterval) {
      this.sleepTimer = 0;
      this.reduceSleep(this.selfWakeAmount);
    }
  }

  wakeUp() {
    this.isAsleep = false;
    this.sleepMeter = 0;
    this.sleepTimer = 0;
  }

  update(enemies = [], hunters = []) {
    if (this.isDead) return null;

    this.fadeGhosts();
    if (this.sinceDamage < 9999) this.sinceDamage++;

    if (this.isAsleep) {
      this.tickSleep();
      this.state = 'idle';
      this.attackTimer = 0;
      return null;
    }

    return this.onUpdate(enemies, hunters);
  }

  onUpdate(enemies, hunters) { return null; }

  fadeGhosts() {
    this.hpGhost = Math.max(this.hp, this.hpGhost - 0.6);
    this.shieldGhost = Math.max(this.shield, this.shieldGhost - 1.2);

    this.hpShown = Math.min(this.hpShown, this.hp);

    if (this.hpShown < this.hp) {
      if (this.healHold > 0) {
        this.healHold--;
      } else {
        this.hpShown = Math.min(this.hp, this.hpShown + 0.4);
      }
    }
  }

  getSprite() {
    throw new Error(`${this.constructor.name}: не реализован getSprite()`);
  }

  draw(ctx) {
    if (this.isDead) return;

    this.getSprite().draw(
      ctx,
      this.x - this.drawOffset.x,
      this.y - this.drawOffset.y,
      this.scale
    );
  }

  drawOverlay(ctx) {
    if (this.isDead) return;
    this.drawBars(ctx);
    this.drawSleep(ctx);
  }

  drawBars(ctx) {
    const w = 50;
    const h = 6;
    const x = this.x - w / 2;
    const y = this.y - 51;

    ctx.save();

    ctx.fillStyle = '#2a0f0f';
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = '#f2c9c9';
    ctx.fillRect(x, y, w * (this.hpGhost / this.maxHp), h);

    ctx.fillStyle = '#3ddc5a';
    ctx.fillRect(x, y, w * (this.hp / this.maxHp), h);

    ctx.fillStyle = '#d92b2b';
    ctx.fillRect(x, y, w * (this.hpShown / this.maxHp), h);

    if (this.maxShield > 0 && (this.shield > 0 || this.shieldGhost > 0)) {
      ctx.fillStyle = '#cfe6ff';
      ctx.fillRect(x, y, w * (this.shieldGhost / this.maxShield), h);
      ctx.fillStyle = '#3b8cff';
      ctx.fillRect(x, y, w * (this.shield / this.maxShield), h);
    }

    if (this.isAsleep) {
      ctx.fillStyle = '#9b7bff';
      ctx.fillRect(x, y, w * (this.sleepMeter / this.sleepMax), h);
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x, y, w, h);

    ctx.restore();
  }

  drawSleep(ctx) {
    if (!this.isAsleep) return;

    const bob = Math.sin(performance.now() / 300) * 3;
    const textX = this.x - 6;
    const textY = this.y - 63 + bob;

    ctx.save();
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#b9c7ff';
    ctx.strokeStyle = '#1b1f3a';
    ctx.lineWidth = 3;
    ctx.strokeText('Z z z', textX, textY);
    ctx.fillText('Z z z', textX, textY);
    ctx.restore();
  }
}