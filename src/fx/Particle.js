import Rect from "../Rect.js";
import Vec from "../utils/Vec.js";
import math from "../utils/math.js";

class Particle {
  constructor(display) {
    //super(8, 8, { fill: "#e20" });
    this.children = [display || new Rect(8, 8, { fill: "#e20" })];
    this.pos = new Vec();
    this.vel = new Vec();
    this.alpha = this.life = 0;
  }
  reset () {
    this.vel.set(math.randf(-5, 5), math.randf(-5, -10));
    this.life = math.randf(0.8, 1.5);
  }
  update(dt) {
    const { pos, vel, life } = this;
    if (life < 0) {
      return;
    }
    this.life -= dt;

    pos.add(vel);
    vel.add({x: 0, y: 30 * dt});
    this.alpha = life;
  }
}

export default Particle;
