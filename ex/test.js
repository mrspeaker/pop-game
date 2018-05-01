import pop from "../src/index.js";
const { Game, KeyControls, math, Sprite, TileSprite, Texture } = pop;

const useWebGl2 = false;
const game = new Game(800, 600, "#board", useWebGl2);
const { scene, w, h } = game;
const controls = new KeyControls();

// Create some textures
const textures = {
  squizz: new Texture("res/images/squizzball.png"),
  bravedigger: new Texture("res/images/bravedigger-tiles.png")
};

// Add the tiles
[...Array(1500)].map(() => {
  const tile = new TileSprite(textures.bravedigger, 48, 48);
  tile.pos.set(math.rand(0, w / 48) * 48, math.rand(0, h / 48) * 48);
  tile.frame.x = math.rand(10);
  tile.frame.y = math.rand(1, 5);
  scene.add(tile);
});

// Add the player
const sprite = scene.add(new Sprite(textures.squizz));
sprite.pos.set(game.w / 2, game.h / 2);

// Run the test!
game.run((dt, t) => {
  const yo = Math.sin(t / 0.2) * 40; // Hey Bob.
  sprite.pos.add({
    x: Math.sign(controls.x) * 200 * dt,
    y: (Math.sign(controls.y) * 200 + yo) * dt
  });
});
