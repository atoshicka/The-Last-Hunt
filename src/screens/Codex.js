import { Sprite } from "../entities/Sprite.js";

const entries = [
    {
        name: 'Comissar',
        role: 'Hunter',
        description: 'Охотник, атакующий железными пулями.',
        sprite: new Sprite({ src: 'src/assets/hunters/comissar-idle.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 96,
        scale: 2,
        stats: { hp: '130', attack: '25', shield: '—', attackSpeed: '2 сек' },
    },

    {
        name: 'Lans',
        role: 'Hunter',
        description: 'Охотник, который воздействует на монстров своей магией экзорцизма.',
        sprite: new Sprite({ src: 'src/assets/hunters/lans-idle.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 96,
        scale: 2,
        stats: { hp: '150', attack: '30', shield: '—', attackSpeed: '2 сек' },
    },

    {
        name: 'Angel',
        role: 'Support',
        description: 'Ангел, имеющий способность создавать искры, необходимые для призыва других охотников.',
        sprite: new Sprite({ src: 'src/assets/hunters/angel.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 96,
        scale: 2,
        stats: { hp: '100', attack: '—', shield: '—', attackSpeed: '—' },
    },

    {
        name: 'Salt',
        role: 'Protection',
        description: 'Предмет, способный задерживать монстров на определенное время.',
        sprite: new Sprite({ src: 'src/assets/others/full-salt.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 96,
        scale: 2,
        stats: { hp: '200', attack: '—', shield: '—', attackSpeed: '—' },
    },

    {
        name: 'Ghost',
        role: 'Enemies',
        description: 'Неупокоенная душа, которая настроена с негативом на других.',
        sprite: new Sprite({ src: 'src/assets/enemies/ghost.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 32,
        scale: 4,
        stats: { hp: '130', attack: '20', shield: '—', attackSpeed: '1.5 сек' },
    },

    {
        name: 'Hellish Dog',
        role: 'Enemies',
        description: 'Монстр из нижних миров. При смертельной угрозе впадает в ярость, которая делает его сильнее и быстрее.',
        sprite: new Sprite({ src: 'src/assets/enemies/hellish-dog.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 64,
        scale: 2.5,
        stats: { hp: '220', attack: '20 / 60', shield: '—', attackSpeed: '1.3 / 0.8 сек' },
    },

    {
        name: 'Ciul',
        role: 'Hunters',
        description: 'Охотница, способная своими пулями пронзить всех монстров на своем пути. С небольшим шансом может выстрелить пулей с солью, что замедлит врагов.',
        sprite: new Sprite({ src: 'src/assets/hunters/ciul-idle.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 92,
        scale: 1,
        stats: { hp: '150', attack: '15', shield: '—', attackSpeed: '2 сек' },
    },

    {
        name: 'Imp',
        role: 'Enemies',
        description: 'Чертенок, который несмотря на то, что не может нанести значительный урон, очень быстрый.',
        sprite: new Sprite({ src: 'src/assets/enemies/imp.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 64,
        scale: 2.5,
        stats: { hp: '100', attack: '10', shield: '—', attackSpeed: '1 сек' },
    },

    {
        name: 'Kain',
        role: 'Hunters',
        description: 'Охотник, способный противостоять одному монстру своим клинком, пожертвовав собой.',
        sprite: new Sprite({ src: 'src/assets/hunters/kain-idle.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 92,
        scale: 2.5,
        stats: { hp: '300', attack: 'MAX', shield: '—', attackSpeed: '—' },
    },

    {
        name: 'Death',
        role: 'Enemies',
        description: 'Смерть, пришедшая по души охотников.',
        sprite: new Sprite({ src: 'src/assets/enemies/death-idle.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 92,
        scale: 1,
        stats: { hp: '500', attack: '50', shield: '—', attackSpeed: '1.6 сек' },
    },

    {
        name: 'Mad',
        role: 'Hunters',
        description: 'Испепеляющая охотница, имеющая барьер из соли вокруг себя.',
        sprite: new Sprite({ src: 'src/assets/hunters/mad-full-idle.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 92,
        scale: 1,
        stats: { hp: '120', attack: '30', shield: '60', attackSpeed: '1.8 сек' },
    },

    {
        name: 'Zombie',
        role: 'Enemies',
        description: 'Зомби, который хочет мозги уааа',
        sprite: new Sprite({ src: 'src/assets/enemies/zombie.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 64,
        scale: 2.5,
        stats: { hp: '200', attack: '30', shield: '—', attackSpeed: '1.5 сек' },
    },

    {
        name: 'Dair',
        role: 'Hunters',
        description: 'Охотник, обладающий способностью лечить и пробуждать из грез других, но не имеющий умений атаковать.',
        sprite: new Sprite({ src: 'src/assets/hunters/dair-idle.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 92,
        scale: 1,
        stats: { hp: '110', attack: '—', shield: '200', attackSpeed: '—' },
    },

    {
        name: 'Gin',
        role: 'Enemies',
        description: 'Существо, погружающее охотников в сладкие грезы, во время которых они не в состоянии атаковать.',
        sprite: new Sprite({ src: 'src/assets/enemies/gin-idle.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 92,
        scale: 1,
        stats: { hp: '100', attack: '—', shield: '—', attackSpeed: '—' },
    },
];

const STAT_LABELS = [
    ['hp', 'HP'],
    ['attack', 'Атака'],
    ['shield', 'Щит'],
    ['attackSpeed', 'Скорость атаки'],
];

let currentIndex = 0;
let isOpen = false;
let canvas, ctx;

export function initCodex(canvasEl, ctxEl) {
    canvas = canvasEl;
    ctx = ctxEl;
}

export function openCodex() {
    isOpen = true;
    currentIndex = 0;
    document.getElementById('codex-screen').classList.remove('hidden');
}

export function closeCodex() {
    isOpen = false;
    document.getElementById('codex-screen').classList.add('hidden');
}

export function isCodexOpen() {
    return isOpen;
}

export function initCodexControls() {
    document.getElementById('btn-codex-close').addEventListener('click', closeCodex);

    document.getElementById('btn-codex-prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + entries.length) % entries.length;
        renderCodexPage();
    });

    document.getElementById('btn-codex-next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % entries.length;
        renderCodexPage();
    });

    document.querySelectorAll('.btn-codex-open').forEach(btn => {
        btn.addEventListener('click', openCodex);
    });

    renderCodexPage();
}

function renderStats(stats) {
    const rows = STAT_LABELS.map(([key, label]) => `
        <div class="codex-stat">
            <span class="codex-stat-label">${label}</span>
            <span class="codex-stat-value">${stats[key]}</span>
        </div>
    `).join('');

    return `<div class="codex-stats">${rows}</div>`;
}

function renderCodexPage() {
    const entry = entries[currentIndex];
    const container = document.getElementById('codex-page');
    const isEnemy = entry.role === 'Enemies';

    container.innerHTML = `
        <div class="codex-sprite-wrap" id="codex-sprite-wrap"></div>
        <div class="codex-role ${isEnemy ? 'enemy' : 'hunter'}">${entry.role}</div>
        <div class="codex-info">
            <div class="codex-name">${entry.name}</div>
            <div class="codex-desc">${entry.description}</div>
            ${renderStats(entry.stats)}
        </div>
    `;

    document.getElementById('codex-counter').textContent = `${currentIndex + 1} / ${entries.length}`;

    const wrap = document.getElementById('codex-sprite-wrap');
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = entry.spriteSize;
    spriteCanvas.height = entry.spriteSize;

    const displaySize = 160;
    spriteCanvas.style.width = displaySize + 'px';
    spriteCanvas.style.height = displaySize + 'px';
    spriteCanvas.style.imageRendering = 'pixelated';
    wrap.appendChild(spriteCanvas);

    const sCtx = spriteCanvas.getContext('2d');

    function drawSprite() {
        sCtx.clearRect(0, 0, entry.spriteSize, entry.spriteSize);

        const draw = () => {
            sCtx.drawImage(
                entry.sprite.image,
                0, 0,
                entry.spriteSize, entry.spriteSize,
                0, 0,
                entry.spriteSize, entry.spriteSize
            );
        };

        if (entry.sprite.loaded) {
            draw();
        } else {
            entry.sprite.image.onload = () => {
                entry.sprite.loaded = true;
                draw();
            };
        }
    }

    drawSprite();
}