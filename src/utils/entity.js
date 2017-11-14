import math from "./math";
import Rect from "../Rect";

function addDebug(entity) {
  entity.children = entity.children || [];
  const bb = new Rect(entity.w, entity.h, { fill: "rgba(255, 0, 0, 0.3)"});
  entity.children.push(bb);
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

function center(entity) {
  const {
    pos, w, h
  } = entity;
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
  const sx = Math.abs(scale.x || 1);
  const sy = Math.abs(scale.y || 1);
  return {
    x: (hit.x * sx) + pos.x,
    y: (hit.y * sy) + pos.y,
    w: hit.w * sx,
    h: hit.h * sy
  };
}

function getBounds(entity) {
  const hit = entity.hitBox || {
    x: 0,
    y: 0,
    w: entity.w,
    h: entity.h
  };
  return {
    x: hit.x + entity.pos.x,
    y: hit.y + entity.pos.y,
    w: hit.w,
    h: hit.h
  };
}

function getCenter(entity) {
  var bounds = getBounds(entity);
  return {
    x: bounds.x + (bounds.w / 2),
    y: bounds.y + (bounds.h / 2)
  };
}

function overlaps(a, b) {
  return a.x + a.w >= b.x &&
    a.x <= b.x + b.w &&
    a.y + a.h >= b.y &&
    a.y <= b.y + b.h;
}

function checkCollision(e1, e2, hitCallback) {
  const a = getBounds(e1);
  const b = getBounds(e2);

  if (
    a.x + a.w >= b.x &&
    a.x <= b.x + b.w &&
    a.y + a.h >= b.y &&
    a.y <= b.y + b.h) {
    hitCallback(e1, e2);
  }
}

function checkCollisions(entity, container, hitCallback) {
  const a = getBounds(entity);

  container.children.forEach(function(entity2) {
    var b = getBounds(entity2);

    if (
      a.x + a.w >= b.x &&
      a.x <= b.x + b.w &&
      a.y + a.h >= b.y &&
      a.y <= b.y + b.h) {
      hitCallback(entity2);
    }
  });
}

function checkContainerCollisions(container1, container2, hitCallback) {
  for (let i = 0; i < container1.children.length; i++) {
    const a = container1.children[i];
    const abox = getBounds(a);
    for (let j = 0; j < container2.children.length; j++) {
      const b = container2.children[j];
      const bbox = getBounds(b);
      if (overlaps(abox, bbox)) {
        hitCallback(a, b);
      }
    }
  }
}

function checkChildrenCollisions(container, hitCallback) {
  const es = container.children;
  if (es.length < 2) {
    return;
  }
  for (let i = 0; i < es.length; i++) {
    const a = getBounds(es[i]);
    for (let j = i + 1; j <= es.length; j++) {
      const b = getBounds(es[j]);
      if (overlaps(a, b)) {
        hitCallback(es[i], es[j]);
      }
    }
  }
}

export default {
  addDebug,
  angle,
  bounds,
  center,
  distance,
  getBounds,
  getCenter,
  overlaps,
  checkCollision,
  checkCollisions,
  checkContainerCollisions,
  checkChildrenCollisions,
};
