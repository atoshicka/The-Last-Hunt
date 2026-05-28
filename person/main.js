import { Commissioner, Sam } from './hunters.js';
import { Ghost } from './enemies.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1100;
canvas.height = 600;

const commissioner = new Commissioner(300, 180);
const sam = new Sam(200, 180);
const ghost = new Ghost(600, 180);

const COLS = 10;
const ROWS = 5;
const CELL_SIZE = 80;
const GRID_X = 150;
const GRID_Y = 80;  

function drawGrid() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = GRID_X + col * CELL_SIZE;
            const y = GRID_Y + row * CELL_SIZE;

            ctx.fillStyle = row % 2 === col % 2 ? '#1a1a2e' : '#16162a';
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

            ctx.strokeStyle = '#2a2a4a';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
        }
    }
}

function update() {
    commissioner.update();
    sam.update();
    ghost.update();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    commissioner.draw(ctx);
    sam.draw(ctx);
    ghost.draw(ctx);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();