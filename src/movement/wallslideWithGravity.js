import entity from "../utils/entity.js";

/*
  Not used: was first pass for gravity, before "hits" were introduced.
  Expects:
  * an entity with the following characteristics:
    * pos vector, w & h
    * vel for vertical velocity
    * jumping flag to indicate if it's in the air.
  * a Pop Map for wallsliding.
*/

function wallslideWithGravity(ent, map, x = 0, y = 0) {
  let tiles;
  let tileEdge;
  const bounds = entity.bounds(ent);

  // Final amounts of movement to allow
  let xo = x;
  let yo = y;

  // Check vertical movement
  if (y !== 0) {
    tiles = map.tilesAtCorners(bounds, 0, yo);
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable);

    // Hit your head
    if (y < 0 && !(tl && tr)) {
      tileEdge = tiles[0].pos.y + tiles[0].h + 1;
      yo = tileEdge - bounds.y;
      ent.vel = 0;
    }
    // Hit your feet
    if (y > 0 && !(bl && br)) {
      tileEdge = tiles[2].pos.y - 1;
      yo = tileEdge - (bounds.y + bounds.h);
      ent.jumping = false;
    }
  }

  // Check horizontal movement
  if (x !== 0) {
    tiles = map.tilesAtCorners(bounds, xo, yo);
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable);

    // Hit left edge
    if (x < 0 && !(tl && bl)) {
      tileEdge = tiles[0].pos.x + tiles[0].w + 1;
      xo = tileEdge - bounds.x;
    }
    // Hit right edge
    if (x > 0 && !(tr && br)) {
      tileEdge = tiles[1].pos.x - 1;
      xo = tileEdge - (bounds.x + bounds.w);
    }

    // Check if we're now falling
    if (!ent.jumping && (bl && br)) {
      const leftTile = map.pixelToMapPos(tiles[2].pos);
      const rightTile = map.pixelToMapPos(tiles[3].pos);
      const falling =
        map.tileAtMapPos({ x: leftTile.x, y: leftTile.y + 1 }).frame.walkable &&
        map.tileAtMapPos({ x: rightTile.x, y: rightTile.y + 1 }).frame.walkable;

      if (falling) {
        ent.jumping = true;
        ent.vel = 3; // Bit of falling speed
      }
    }
  }
  // xo & yo contain the amount we're allowed to move by.
  return { x: xo, y: yo };
}

export default wallslideWithGravity;
