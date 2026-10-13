import { Hunter, createSprite } from './Hunter.js';

const FPS = 60;

export class Dair extends Hunter {
  constructor(x, y) {
    super(x, y, { hp: 110, offset: { x: 48, y: 46 } });

    this.selfShield = 200;
    this.shieldRegen = 20;
    this.regenInterval = 5 * FPS;
    this.regenDelay = 2.5 * FPS;
    this.regenTimer = 0;
    this.underAttackTimer = 0;
    this.applyShield(this.selfShield);

    this.healAmount = 20;
    this.healInterval = 8 * FPS;
    this.healTimer = 0;
    this.healPoseTime = 40;
    this.healPoseTimer = 0;
    this.healTarget = null;

    this.wakeInterval = 2 * FPS;
    this.wakePower = 20;
    this.wakeTimer = 0;
    this.wakeTarget = null;

    this.idleSprite = createSprite('src/assets/hunters/dair-idle.png');
    this.attackSprite = createSprite('src/assets/hunters/dair-attack.png');
  }

  getSprite() {
    return this.state === 'attack' ? this.attackSprite : this.idleSprite;
  }

  isClaimedByOther(hunters, field, target) {
    return hunters.some(h => h !== this && h[field] === target);
  }

  pickTarget(hunters, field, predicate) {
    const candidates = hunters.filter(
      h => predicate(h) && !this.isClaimedByOther(hunters, field, h)
    );
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  releaseTargets() {
    this.healTarget = null;
    this.wakeTarget = null;
    this.wakeTimer = 0;
  }

  takeDamage(amount) {
    this.underAttackTimer = this.regenDelay;
    this.regenTimer = 0;
    super.takeDamage(amount);
  }

  putToSleep() {
    super.putToSleep();
    if (this.isAsleep) {
      this.releaseTargets();
      this.healPoseTimer = 0;
    }
  }

  die() {
    super.die();
    this.releaseTargets();
    this.healPoseTimer = 0;
  }

  updateShield() {
    if (this.underAttackTimer > 0) {
      this.underAttackTimer--;
      this.regenTimer = 0;
      return;
    }

    this.regenTimer++;
    if (this.regenTimer < this.regenInterval) return;
    this.regenTimer = 0;

    this.regenShield(this.shieldRegen);
  }

  isValidHealTarget(target, hunters) {
    return !!target && hunters.includes(target) && !target.isDead && target.hp < target.maxHp;
  }

  updateHealing(hunters) {
    if (this.healPoseTimer > 0) this.healPoseTimer--;

    if (!this.isValidHealTarget(this.healTarget, hunters)) {
      this.healTarget = null;
    }

    if (!this.healTarget) {
      this.healTarget = this.pickTarget(
        hunters,
        'healTarget',
        h => !h.isDead && h.hp < h.maxHp
      );
    }

    if (!this.healTarget) return;

    this.healTimer++;
    if (this.healTimer < this.healInterval) return;

    this.healTimer = 0;
    this.healPoseTimer = this.healPoseTime;
    this.healTarget.heal(this.healAmount);

    if (this.healTarget.hp >= this.healTarget.maxHp) {
      this.healTarget = null;
    }
  }

  isValidWakeTarget(target, hunters) {
    return !!target && hunters.includes(target) && !target.isDead && target.isAsleep;
  }

  updateWaking(hunters) {
    if (!this.isValidWakeTarget(this.wakeTarget, hunters)) {
      this.wakeTarget = null;
      this.wakeTimer = 0;
    }

    if (!this.wakeTarget) {
      this.wakeTarget = this.pickTarget(
        hunters,
        'wakeTarget',
        h => h !== this && h.isAsleep && !h.isDead
      );
    }

    if (!this.wakeTarget) return false;

    this.wakeTimer++;
    if (this.wakeTimer >= this.wakeInterval) {
      this.wakeTimer = 0;
      this.wakeTarget.reduceSleep(this.wakePower);
      if (!this.wakeTarget.isAsleep) this.wakeTarget = null;
    }

    return true;
  }

  onUpdate(enemies, hunters = []) {
    this.updateShield();
    this.updateHealing(hunters);
    const waking = this.updateWaking(hunters);

    this.state = (waking || this.healPoseTimer > 0) ? 'attack' : 'idle';

    this.idleSprite.update();
    this.attackSprite.update();
    return null;
  }
}