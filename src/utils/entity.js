import math from "./math.js";
import Rect from "../Rect.js";

function addDebug(e) {
  e.children = e.children || [];
  const bb = new Rect(e.w, e.h, { fill: "rgba(255, 0, 0, 0.3)" });
  e.children.push(bb);
  if (e.hitBox) {
    const { x, y, w, h } = e.hitBox;
    const hb = new Rect(w, h, { fill: "rgba(255, 0, 0, 0.5)" });
    hb.pos.x = x;
    hb.pos.y = y;
    e.children.push(hb);
  }
  return e;
}

function angle(a, b) {
  return math.angle(center(a), center(b));
}

function center(entity) {
  const { pos, w, h } = entity;
  return {
    x: pos.x + w / 2,
    y: pos.y + h / 2
  };
}

function distance(a, b) {
  return math.distance(center(a), center(b));
}

function bounds(entity) {
  const { w, h, pos, hitBox, scale } = entity;
  const hit = hitBox || { x: 0, y: 0, w, h };
  const sx = scale ? Math.abs(scale.x) : 1;
  const sy = scale ? Math.abs(scale.y) : 1;
  return {
    x: hit.x * sx + pos.x,
    y: hit.y * sy + pos.y,
    w: hit.w * sx - 1,
    h: hit.h * sy - 1
  };
}

function hit(e1, e2) {
  const a = bounds(e1);
  const b = bounds(e2);
  return (
    a.x + a.w >= b.x && a.x <= b.x + b.w && a.y + a.h >= b.y && a.y <= b.y + b.h
  );
}

function hits(entity, container, hitCallback) {
  const a = bounds(entity);
  container.map(e2 => {
    const b = bounds(e2);
    if (
      a.x + a.w >= b.x &&
      a.x <= b.x + b.w &&
      a.y + a.h >= b.y &&
      a.y <= b.y + b.h
    ) {
      hitCallback(e2);
    }
  });
}

export default {
  addDebug,
  angle,
  bounds,
  center,
  distance,
  hit,
  hits
};
