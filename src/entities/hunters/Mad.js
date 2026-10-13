import { Shooter } from "./Shooter.js";
import { createSprite } from "./Hunter.js";

const FPS = 60;

export class Mad extends Shooter {
  constructor(x, y) {
    super(x, y, {
      hp: 120,
      attackSpeed: 110,
      idleSrc: 'src/assets/hunters/mad-full-idle.png',
      attackSrc: 'src/assets/hunters/mad-full-attack.png',
      offset: { x: 48, y: 46 },
    });

    this.applyShield(60);
    this.shieldRegen = 10;
    this.regenInterval = 20 * FPS;
    this.regenTimer = 0;

    this.bareIdleSprite = createSprite('src/assets/hunters/mad-idle.png');
    this.bareAttackSprite = createSprite('src/assets/hunters/mad-attack.png');

    this.armorStages = [
      { above: 0, idle: this.idleSprite, attack: this.attackSprite },
      { above: -1, idle: this.bareIdleSprite, attack: this.bareAttackSprite },
    ];
  }

  get isArmored() {
    return this.shield > 0;
  }

  getArmorStage() {
    const ratio = this.maxShield > 0 ? this.shield / this.maxShield : 0;
    return this.armorStages.find(stage => ratio > stage.above);
  }

  getSprite() {
    const stage = this.getArmorStage();
    return this.state === 'attack' ? stage.attack : stage.idle;
  }

  updateSprites() {
    const stage = this.getArmorStage();
    stage.idle.update();
    stage.attack.update();
  }

  updateShield() {
    if (this.shield >= this.maxShield) {
      this.regenTimer = 0;
      return;
    }

    this.regenTimer++;
    if (this.regenTimer < this.regenInterval) return;
    this.regenTimer = 0;

    this.regenShield(this.shieldRegen);
  }

  onUpdate(enemies, hunters) {
    this.updateShield();
    return super.onUpdate(enemies, hunters);
  }

  createAction() {
    return { blazingShoot: true, x: this.x + 48, y: this.y };
  }
}