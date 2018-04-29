class Timer {
  constructor(length = 1.0, onTick, onDone, delay = 0) {
    this.elapsed = 0;
    this.length = length;
    this.onTick = onTick;
    this.onDone = onDone;
    this.delay = delay;
    this.dead = false;
  }
  update(dt) {
    const { length, onTick, onDone, delay } = this;
    if (delay > 0) {
      this.delay -= dt;
      return;
    }
    this.elapsed += dt;
    const ratio = this.elapsed / length;
    if (ratio > 1) {
      onDone && onDone();
      this.dead = true;
    } else {
      onTick && onTick(ratio);
    }
  }
}

export default Timer;
