function applyForce (e, force) {
  const { acc, mass = 1 } = e;
  acc.x += force.x / mass;
  acc.y += force.y / mass;
}

function applyImpulse (e, force, dt) {
  applyForce(e, { x: force.x / dt, y: force.y / dt });
}

function integrate (e, dt) {
  const { vel, acc } = e;
  const vx = vel.x + acc.x * dt;
  const vy = vel.y + acc.y * dt;
  const x = (vel.x + vx) / 2 * dt;
  const y = (vel.y + vy) / 2 * dt;
  vel.set(vx, vy);
  acc.set(0, 0);
  return { x, y };
}

function integratePos (e, dt) {
  return e.pos.add(integrate(e, dt));
}

function speed ({vel}) {
  return Math.sqrt(vel.x * vel.x + vel.y * vel.y);
}

export default {
  applyForce,
  applyImpulse,
  integrate,
  integratePos,
  speed
};