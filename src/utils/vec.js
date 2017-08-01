function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}

function addTo(a, b) {
  a.x += b.x;
  a.y += b.y;
  return a;
}

function copy(a, b) {
  a.x = b.x;
  a.y = b.y;
  return a;
}

function set(v, x, y) {
  v.x = x;
  v.y = y;
  return v;
}

export default {
  add,
  addTo,
  copy,
  set,
};
