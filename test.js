import pop from "./src";
const { Game, KeyControls, math, Sprite, TileSprite, Texture } = pop;

const useWebGl2 = true;
const game = new Game(800, 600, "#board", useWebGl2);

const { scene, w, h } = game;
const controls = new KeyControls();

const sprite = new Sprite(new Texture("res/images/squizzball.png"));
sprite.pos.set(game.w / 2, game.h / 2);

const texture = new Texture("res/images/bravedigger-tiles.png");
for (let i = 0; i < 1500; i++) {
  const tile = scene.add(new TileSprite(texture, 48, 48));
  tile.pos.set(math.rand(0, w / 48) * 48, math.rand(0, h / 48) * 48);
  tile.frame.x = math.rand(10);
  tile.frame.y = math.rand(1, 5);
}

scene.add(sprite);

game.run(dt => {
  sprite.pos.add({
    x: Math.sign(controls.x) * 200 * dt,
    y: Math.sign(controls.y) * 200 * dt
  });
});
