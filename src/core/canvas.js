export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

canvas.width = 1100;
canvas.height = 600;

export const COLS = 10;
export const ROWS = 5;
export const CELL_SIZE = 96;
export const GRID_X = 150;
export const GRID_Y = 80;

export function getCellCenter(col, row) {
  return {
    x: GRID_X + col * CELL_SIZE + CELL_SIZE / 2,
    y: GRID_Y + row * CELL_SIZE + CELL_SIZE / 2,
  };
}