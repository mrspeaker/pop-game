import entity from "../utils/entity.js";

/*
  Expects:
  * an entity with the following characteristics:
    * pos vector, w & h
  * a Pop Map for wallsliding.
  * The x and y amount requesting to move
*/

function wallslide(ent, map, x = 0, y = 0) {
  let tiles;
  let tileEdge;
  const bounds = entity.bounds(ent);
  const hits = { up: false, down: false, left: false, right: false };

  // Final amounts of movement to allow
  let xo = x;
  let yo = y;

  // Check vertical movement
  if (y !== 0) {
    tiles = map.tilesAtCorners(bounds, 0, yo);
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable);

    // Hit your head
    if (y < 0 && !(tl && tr)) {
      hits.up = true;
      tileEdge = tiles[0].pos.y + tiles[0].h;
      yo = tileEdge - bounds.y;
    }
    // Hit your feet
    if (y > 0) {
      const isCloud = tiles[2].frame.cloud || tiles[3].frame.cloud;
      if (!(bl && br) || isCloud) {
        tileEdge = tiles[2].pos.y - 1;
        const dist = tileEdge - (bounds.y + bounds.h);
        if (!isCloud || dist > -10) {
          hits.down = true;
          yo = dist;
        }
      }
    }
  }

  // Check horizontal movement
  if (x !== 0) {
    tiles = map.tilesAtCorners(bounds, xo, yo);
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable);

    // Hit left edge
    if (!(tl && bl)) {
      hits.left = true;
      tileEdge = tiles[0].pos.x + tiles[0].w;
      xo = tileEdge - bounds.x;
    }
    // Hit right edge
    if (!(tr && br)) {
      hits.right = true;
      tileEdge = tiles[1].pos.x - 1;
      xo = tileEdge - (bounds.x + bounds.w);
    }
  }

  // xo & yo contain the amount we're allowed to move by.
  return { x: xo, y: yo, hits };
}

export default wallslide;
