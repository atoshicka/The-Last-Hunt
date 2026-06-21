export class Sprite {
  constructor({ src, frameWidth, frameHeight, frames, speed }) {
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.speed = speed;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.loaded = false;

    this.image = new Image();
    this.image.onload = () => { this.loaded = true; };
    this.image.src = src;
  }

  update() {
    if (this.frames <= 1) return;
    this.frameTimer++;
    if (this.frameTimer >= this.speed) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frames;
    }
  }

  draw(ctx, x, y, scale = 1) {
    if (!this.loaded) return;
    ctx.drawImage(
      this.image,
      0,
      this.frameIndex * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      x, y,
      this.frameWidth * scale,
      this.frameHeight * scale
    );
  }
}