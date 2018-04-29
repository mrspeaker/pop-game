import pop from "../src/index.js";
const { entity, Vec, TileMap, wallslide } = pop;

const dom = document.querySelector("#res");
const log = (...msg) => (dom.innerHTML += msg.join("&nbsp") + "<br />");
log("Sprite, TileMap, and wallslide collision tests");
log("<br/>------");
log("- Should print 'TESTS DONE' at bottom (check console for errors!)");
log("------");
const assert = (test, ...args) => {
  if (!test) {
    console.warn("Failed:", ...args);
    log("🔴", [...args].map(a => JSON.stringify(a)));
  } else {
    console.log("Passed:", ...args);
    log("🌳", [...args].map(a => JSON.stringify(a)));
  }
};

const makeEnt = (w = 32, h = 32) => ({ w, h, pos: new Vec() });
const boundsEquals = (e, bounds) => {
  const b = entity.bounds(e);
  return (
    b.x === bounds.x && b.y === bounds.y && b.w === bounds.w && b.h === bounds.h
  );
};

const e1 = makeEnt(1, 1);
const e2 = makeEnt(1, 1);
const e3 = makeEnt(2, 2);
const e4 = makeEnt(2, 2);

///// Pre-bounds test

const boundslessHit = (a, b) =>
  a.pos.x + a.w - 1 >= b.pos.x &&
  a.pos.x <= b.pos.x + b.w - 1 &&
  a.pos.y + a.h - 1 >= b.pos.y &&
  a.pos.y <= b.pos.y + b.h - 1;

assert(boundslessHit(e1, e2), "hit simple (1x1)", e1.pos, e2.pos);
e2.pos.set(1, 0);
assert(!boundslessHit(e1, e2), "miss simple (1x1)", e1.pos, e2.pos);
e2.pos.set(0, 1);
assert(!boundslessHit(e1, e2), "miss simple, below (1x1)", e1.pos, e2.pos);

assert(boundslessHit(e3, e4), "hit simple (2x2)", e3.pos, e4.pos);
e4.pos.set(1, 1);
assert(boundslessHit(e3, e4), "hit after move simple (2x2)", e3.pos, e4.pos);
e4.pos.set(2, 0);
assert(!boundslessHit(e3, e4), "miss simple (2x2)", e3.pos, e4.pos);

//// Post-bounds tests

assert(boundsEquals(e1, { x: 0, y: 0, w: 0, h: 0 }), "bounds for 1x1 sprite");
assert(boundsEquals(e3, { x: 0, y: 0, w: 1, h: 1 }), "bounds for 2x2 sprite");

e1.pos.add({ x: 1, y: 1 });
e3.pos.add({ x: 1, y: 1 });

assert(
  boundsEquals(e1, { x: 1, y: 1, w: 0, h: 0 }),
  "bounds for 1x1 after moving"
);
assert(
  boundsEquals(e3, { x: 1, y: 1, w: 1, h: 1 }),
  "bounds for 2x2 after moving"
);

e1.pos.set(1, 1);
for (let y = 0; y <= 2; y++) {
  for (let x = 0; x <= 2; x++) {
    e2.pos.set(x, y);
    const shouldHit = e1.pos.x === e2.pos.x && e1.pos.y === e2.pos.y;
    assert(
      entity.hit(e1, e2) === shouldHit,
      shouldHit ? "Should hit" : "Should not hit",
      e1.pos,
      e2.pos
    );
  }
}

e3.pos.set(1, 1);
e4.pos.set(0, 0);

assert(entity.hit(e3, e4), "should hit 2x2", e3.pos, e4.pos);
e3.pos.set(2, 0);
assert(!entity.hit(e3, e4), "should not hit 2x2 right", e3.pos, e4.pos);
e3.pos.set(0, 2);
assert(!entity.hit(e3, e4), "should not hit 2x2 below", e3.pos, e4.pos);

///// TILE SPRITE COLLISIONS

const onTiles = tiles => tiles.every(t => !!t);
const allSameTiles = tiles => {
  return (
    onTiles(tiles) && tiles.slice(1).every((t, i) => tiles[i + 1] === tiles[i])
  );
};
const allDifferentTiles = ([a, b, c, d]) => {
  return a !== b && a !== c && a !== d && b !== c && b !== d && c !== d;
};
const tileView = obj => {
  if (!obj) return "[no tile]";
  const { pos: { x, y }, frame } = obj;
  return { x, y, frame };
};

let mapW = 2;
let mapH = 1;
let tileW = 1;
let tileH = 1;
let map = new TileMap(
  [...Array(mapW * mapH)].map((_, i) => i),
  mapW,
  mapH,
  tileW,
  tileH
);

e1.pos.set(0, 0);
let edgeTiles = map.tilesAtCorners(entity.bounds(e1));
assert(
  allSameTiles(edgeTiles),
  "all same tiles at 0, 0 (1x1)",
  edgeTiles.map(tileView)
);

e1.pos.set(1, 0);
edgeTiles = map.tilesAtCorners(entity.bounds(e1));
assert(
  onTiles(edgeTiles),
  "all are tiles at 1, 0 (1x1)",
  edgeTiles.map(tileView)
);

mapW = 2;
mapH = 2;
tileW = 2;
tileH = 2;
map = new TileMap(
  [...Array(mapW * mapH)].map((_, i) => i),
  mapW,
  mapH,
  tileW,
  tileH
);

e3.pos.set(1, 1);
edgeTiles = map.tilesAtCorners(entity.bounds(e3));
assert(onTiles(edgeTiles), "all tiles on 2x2 map at 1, 1");

assert(
  allDifferentTiles(edgeTiles),
  "all tiles different on 2x2",
  edgeTiles.map(tileView)
);

e3.pos.set(0, 0);
edgeTiles = map.tilesAtCorners(entity.bounds(e3));
assert(
  allSameTiles(edgeTiles),
  "all same on on 2x2 map at 0, 0",
  edgeTiles.map(tileView)
);

/////// WALLSLIDE COLLISION RESOLUTION

mapW = 3;
mapH = 1;
tileW = 1;
tileH = 1;
map = new TileMap(
  [
    { i: 0, walkable: true },
    { i: 1, walkable: false },
    { i: 1, walkable: true }
  ],
  mapW,
  mapH,
  tileW,
  tileH
);

const someHits = hits => hits.up || hits.down || hits.left || hits.right;
const noHits = hits => !someHits(hits);
const only = (hits, dir) =>
  hits[dir] &&
  (hits.up ? 1 : 0) +
    (hits.down ? 1 : 0) +
    (hits.left ? 1 : 0) +
    (hits.right ? 1 : 0) ===
    1;

e1.pos.set(0, 0);
let r = wallslide(e1, map, 0, 0);
assert(noHits(r.hits), "no move, no hits");

r = wallslide(e1, map, 1, 0);
assert(only(r.hits, "right") && r.x === 0, "blocked by tile, right", r);

e1.pos.set(2, 0);
r = wallslide(e1, map, -1, 0);
assert(only(r.hits, "left") && r.x === 0, "blocked by tile, left", r);

mapW = 3;
mapH = 1;
tileW = 2;
tileH = 2;
map = new TileMap(
  [
    { i: 0, walkable: true },
    { i: 1, walkable: false },
    { i: 1, walkable: true }
  ],
  mapW,
  mapH,
  tileW,
  tileH
);

e3.pos.set(0, 0);
r = wallslide(e3, map, 0, 0);
assert(noHits(r.hits), "no move, no hits (2x2)");

r = wallslide(e3, map, 2, 0);
assert(only(r.hits, "right") && r.x === 0, "blocked by tile, right (2x2)", r);

/// UP & DOWN

mapW = 1;
mapH = 3;
tileW = 1;
tileH = 1;
map = new TileMap(
  [
    { i: 0, walkable: true },
    { i: 1, walkable: false },
    { i: 1, walkable: true }
  ],
  mapW,
  mapH,
  tileW,
  tileH
);

e1.pos.set(0, 0);
r = wallslide(e1, map, 0, 0);
assert(noHits(r.hits), "no move, no hits");

r = wallslide(e1, map, 0, 1);
assert(only(r.hits, "down") && r.y === 0, "blocked by tile, below", r);

e1.pos.set(0, 2);
r = wallslide(e1, map, 0, -1);
assert(only(r.hits, "up") && r.y === 0, "blocked by tile, above", r);

mapW = 1;
mapH = 3;
tileW = 2;
tileH = 2;
map = new TileMap(
  [
    { i: 0, walkable: true },
    { i: 1, walkable: false },
    { i: 1, walkable: true }
  ],
  mapW,
  mapH,
  tileW,
  tileH
);

e3.pos.set(0, 0);
r = wallslide(e3, map, 0, 2);
assert(only(r.hits, "down") && r.y === 0, "blocked by tile, below (2x2)", r);
e3.pos.set(0, 5);
r = wallslide(e3, map, 0, -2);
assert(only(r.hits, "up") && r.y === -1, "blocked by tile, above (2x2)", r);

mapW = 2;
mapH = 2;
tileW = 3;
tileH = 3;
map = new TileMap(
  [
    { i: 0, walkable: true },
    { i: 1, walkable: false },
    { i: 2, walkable: false },
    { i: 3, walkable: true }
  ],
  mapW,
  mapH,
  tileW,
  tileH
);

e3.pos.set(0, 0);
r = wallslide(e3, map, 2, 2);
assert(
  r.hits.down && r.hits.right && r.x === 1 && r.y == 1,
  "blocked moving diag (2x2)",
  r
);

// Can "jump" tiles :( ... (using 1x1 sprite to demonstrate)
e1.pos.set(2, 2);
r = wallslide(e3, map, 1, 1);
assert(!r.hits.down && !r.hits.right, "can jump tile :(", r);

mapW = 2;
mapH = 2;
tileW = 3;
tileH = 3;
map = new TileMap(
  [
    { i: 0, walkable: true },
    { i: 1, walkable: false },
    { i: 2, walkable: false },
    { i: 3, walkable: true }
  ],
  mapW,
  mapH,
  tileW,
  tileH
);

e3.pos.set(4, 4);
r = wallslide(e3, map, -2, -2);
assert(
  r.hits.up && r.hits.left && r.x === -1 && r.y === -1,
  "blocked moving diag up/left (2x2)",
  r
);

log("------");
log("- TESTS DONE");
log("------");
