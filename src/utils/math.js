function angle(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const angle = Math.atan2(dy, dx);

  return angle;
}

function clamp(x, min, max) {
  return Math.max(min, Math.min(x, max));
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function gauss(x) {
  return Math.exp(-x * x);
}

function gaussDistance(x, center, dist) {
  return gauss((x - center) / dist);
}

function lerp(x, min, max) {
  return (x - min) / (max - min);
}

function mix(a, b, p) {
  return a * (1 - p) + b * p;
}

function rand(min, max) {
  return Math.floor(randf(min, max));
}

function randf(min, max) {
  if (max == null) {
    max = min || 1;
    min = 0;
  }
  return Math.random() * (max - min) + min;
}

function randOneIn(max) {
  return rand(0, max) === 0;
}

function randOneFrom(items) {
  return items[rand(0, items.length)];
}

function smoothstep(value, inf = 0, sup = 1) {
  var x = clamp(lerp(value, inf, sup), 0, 1);
  return x * x * (3 - 2 * x); // smooth formula
}

export default {
  angle,
  clamp,
  distance,
  lerp,
  gauss,
  gaussDistance,
  mix,
  rand,
  randf,
  randOneIn,
  randOneFrom,
  smoothstep
};
