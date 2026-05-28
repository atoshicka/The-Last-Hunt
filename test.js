function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0d0d1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid(); // ← добавь сюда

  commissioner.draw(ctx);
  sam.draw(ctx);
  ghost.draw(ctx);
}