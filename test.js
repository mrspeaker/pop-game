import pop from "./src";
const { Game, KeyControls, math, Sprite, Texture } = pop;

const game = new Game(800, 600, "#board", true);
const { scene, w, h } = game;
const controls = new KeyControls();

const texture = new Texture("res/images/squizzball.png");
const sprite = scene.add(new Sprite(texture));
sprite.pos.set(game.w / 2, game.h / 2);

let last;
for (let i = 0; i < 200; i++) {
  last = scene.add(new Sprite(texture));
  last.pos.set(math.rand(0, w), math.rand(0, h));
}
last.pos.copy(sprite.pos).add({ x: 50, y: 0 });

game.run((dt, t) => {
  sprite.pos.add({
    x: Math.sign(controls.x) * 200 * dt,
    y: Math.sign(controls.y) * 200 * dt
  });

  last.pos.y += Math.sin(t * 10) * 200 * dt;
  last.pos.y += Math.sin(t * 11) * 200 * dt;
});
