import Rect from "../Rect.js";
import Container from "../Container.js";
import Vec from "../utils/Vec.js";

class OneUp extends Container {
  constructor(display, speed = 2, life = 0.6) {
    super();
    //40, 30, { fill: "#ff0" });
    this.children = [display || new Rect(40, 30, {fill: "#ff0"})];
    this.life = life;
    this.lifeCount = 0;
    this.pos = new Vec();
    this.vel = new Vec(0, -speed);
  }
  update(dt) {
    super.update(dt);
    const { life, lifeCount, pos, vel } = this;
    const ratio = lifeCount / life;
    this.alpha = 1 - (ratio * ratio);
    pos.add(vel);

    if ((this.lifeCount += dt) >= life) {
      this.dead = true;
    }
  }
}

export default OneUp;
