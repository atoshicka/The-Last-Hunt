import { Sprite } from "../entities/Sprite.js";

const entries = [
    {
        name: 'Comissar',
        role: 'Hunter',
        description: 'Охотник, атакующий железными пулями.',
        sprite: new Sprite({ src: 'assets/hunters/comissar-idle.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 96,
        scale: 2,
    },

    {
        name: 'Lans',
        role: 'Hunter',
        description: 'Охотник, который воздействует на монстров своей магией экзорцизма.',
        sprite: new Sprite({ src: 'assets/hunters/lans-idle.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 96,
        scale: 2,
    },

    {
        name: 'Angel',
        role: 'Support',
        description: 'Ангел, имеющий способность создавать искры, необходимые для призыва других охотников.',
        sprite: new Sprite({ src: 'assets/hunters/angel.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 96,
        scale: 2,
    },

    {
        name: 'Salt',
        role: 'Protection',
        description: 'Предмет, способный задерживать монстров на определенное время.',
        sprite: new Sprite({ src: 'assets/others/full-salt.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 96,
        scale: 2,
    },

    {
        name: 'Ghost',
        role: 'Enemies',
        description: 'Неупокоенная душа, которая настроена с негативом на других.',
        sprite: new Sprite({ src: 'assets/enemies/ghost.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 32,
        scale: 4,
    },

    {
        name: 'Hellish Dog',
        role: 'Enemies',
        description: 'Монстр из нижних миров. При смертельной угрозе впадает в ярость, которая делает его сильнее и быстрее.',
        sprite: new Sprite({ src: 'assets/enemies/hellish-dog.png', frameWidth: 96, frameHeight: 96, frames: 1, speed: 1 }),
        spriteSize: 64,
        scale: 2.5,
    },
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

function renderCodexPage() {
    const entry = entries[currentIndex];
    const container = document.getElementById('codex-page');
    const isEnemy = entry.role === 'Enemies';

      container.innerHTML = `
        <div class="codex-role ${isEnemy ? 'enemy' : 'hunter'}">${entry.role}</div>
        <div class="codex-sprite-wrap" id="codex-sprite-wrap"></div>
        <div class="codex-name">${entry.name}</div>
        <div class="codex-desc">${entry.description}</div>
        <div class="codex-counter">${currentIndex + 1} / ${entries.length}</div>
    `;

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
        
        if (entry.sprite.loaded) {
            sCtx.drawImage(
            entry.sprite.image,
            0, 0,
            entry.spriteSize, entry.spriteSize,
            0, 0,
            entry.spriteSize, entry.spriteSize
            );
        } else {
            entry.sprite.image.onload = () => {
            entry.sprite.loaded = true;
            sCtx.drawImage(
                entry.sprite.image,
                0, 0,
                entry.spriteSize, entry.spriteSize,
                0, 0,
                entry.spriteSize, entry.spriteSize
            );
            };
        }
        }

        drawSprite();
}