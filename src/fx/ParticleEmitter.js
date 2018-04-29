import Container from "../Container.js";
import Vec from "../utils/Vec.js";
import Particle from "./Particle.js";

class ParticleEmitter extends Container {
  constructor(display) {
    super();
    this.pos = new Vec();

    this.particles = Array.from(new Array(20), () => this.add(new Particle(display)));
    this.lastHit = 0;
  }
  play(pos) {
    const now = Date.now();
    if (now - this.lastHit < 300) return;
    this.lastHit = now;

    this.pos.copy(pos);
    this.particles.forEach(p => {
      p.reset();
      p.pos.set(0, 0);
    });
  }
}

export default ParticleEmitter;
