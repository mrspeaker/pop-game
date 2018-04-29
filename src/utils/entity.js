import math from "./math.js";
import Rect from "../Rect.js";

const scale_id = { x: 1, y: 1 };

function addDebug(entity) {
  entity.children = entity.children || [];
  entity.children.push(
    new Rect(entity.w, entity.h, { fill: "rgba(255, 0, 0, 0.3)" })
  );
  if (entity.hitBox) {
    const { x, y, w, h } = entity.hitBox;
    const hb = new Rect(w, h, { fill: "rgba(255, 0, 0, 0.5)" });
    hb.pos.x = x;
    hb.pos.y = y;
    entity.children.push(hb);
  }
  return entity;
}

function angle(a, b) {
  return math.angle(center(a), center(b));
}

function bounds(entity) {
  const { w, h, pos, hitBox, scale } = entity;
  const sc = scale || scale_id;
  const hit = hitBox || { x: 0, y: 0, w: w, h: h };
  return {
    x: pos.x + (sc.x > 0 ? hit.x : w - (hit.x + hit.w)),
    y: pos.y + (sc.y > 0 ? hit.y : h - (hit.y + hit.h)),
    w: hit.w - 1,
    h: hit.h - 1
  };
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

function hit(e1, e2) {
  const a = bounds(e1);
  const b = bounds(e2);
  return (
    a.x + a.w >= b.x &&
    a.x <= b.x + b.w &&
    a.y + a.h >= b.y &&
    a.y <= b.y + b.h
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
