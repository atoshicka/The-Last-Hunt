import { Shooter } from "./Shooter.js";

export class Lans extends Shooter {
    constructor(x, y) {
        super(x, y, {
            hp: 150,
            attackSpeed: 120,
            idleSrc: 'src/assets/hunters/lans-idle.png',
            attackSrc: 'src/assets/hunters/lans-attack.png',
            offset: { x: 40, y: 45 },
        });
    }

    createAction(target) {
        return { flame: true, x: target.x, y: target.y };
    }
}